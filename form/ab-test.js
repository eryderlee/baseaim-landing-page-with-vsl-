/**
 * Baseaim A/B Tracker — Form site
 *
 * Reads the variant assignment from window.BASEAIM_AB (set by ab-router.js)
 * and pushes engagement + conversion events to dataLayer (for GTM/GA4) and
 * Meta Pixel, all tagged with ab_variant so the two sites can be compared.
 *
 * The inline form-submit handler in index.html ALSO calls
 * window.BASEAIM_TRACK.leadSubmit(props) when the lead form is submitted —
 * that fires the canonical conversion event on this side of the test.
 */
(function () {
    'use strict';

    var AB = window.BASEAIM_AB || { testName: 'vsl_vs_form', variant: 'form', site: 'form', source: 'fallback' };
    var VARIANT = AB.variant;
    var TEST_NAME = AB.testName;

    window.dataLayer = window.dataLayer || [];

    // Push BOTH ab_variant (new key) and ab_test_variant (legacy key matched
    // by the existing GA4 "AB Test Variant" dimension + GTM dlv variable).
    function track(event, props) {
        var payload = {
            event: event,
            ab_test_name: TEST_NAME,
            ab_variant: VARIANT,
            ab_test_variant: VARIANT,
            ab_site: 'form'
        };
        if (props) {
            for (var k in props) if (Object.prototype.hasOwnProperty.call(props, k)) payload[k] = props[k];
        }
        window.dataLayer.push(payload);
    }

    function fbqCustom(name, props) {
        if (typeof fbq === 'undefined') return;
        var payload = {
            ab_test_name: TEST_NAME,
            ab_variant: VARIANT,
            ab_test_variant: VARIANT,
            ab_site: 'form'
        };
        if (props) for (var k in props) if (Object.prototype.hasOwnProperty.call(props, k)) payload[k] = props[k];
        try { fbq('trackCustom', name, payload); } catch (e) {}
    }

    // ============================================================
    // Assignment fire
    // ============================================================
    track('ab_test_assigned', { ab_assignment_source: AB.source });
    fbqCustom('ABTestAssigned', { source: AB.source });

    // ============================================================
    // Public hook for the inline form-submit handler
    // ============================================================
    window.BASEAIM_TRACK = {
        leadSubmit: function (props) {
            track('lead_submit', props);
            // Note: the inline handler also fires fbq('track', 'Lead', ...);
            // we don't double-fire that here.
        },
        leadFormViewed: function () {
            track('lead_form_viewed');
        },
        modalOpened: function () {
            track('lead_modal_opened');
        }
    };

    // ============================================================
    // Cal.com booking confirmation — listen for postMessage from iframe
    //
    // The form site loads Cal.com inside the modal AFTER form submission, so
    // a fresh booking confirmation here is a "form-then-booked" conversion.
    // Defensive matching across Cal's event-naming variations.
    // ============================================================
    var calBookingFired = false;
    window.addEventListener('message', function (e) {
        if (!e || !e.origin) return;
        if (e.origin.indexOf('cal.com') === -1) return;
        var d = e.data;
        if (!d || (typeof d !== 'object' && typeof d !== 'string')) return;
        if (typeof d === 'string') {
            try { d = JSON.parse(d); } catch (err) { return; }
        }
        var label = String(d.type || d.action || d.name || '').toLowerCase();
        var isBooking = label.indexOf('booking') !== -1 ||
                        label.indexOf('book_successful') !== -1 ||
                        label.indexOf('book-successful') !== -1;
        var isSuccess = label.indexOf('success') !== -1 ||
                        label.indexOf('confirmed') !== -1 ||
                        label.indexOf('complete') !== -1;
        if (isBooking && isSuccess && !calBookingFired) {
            calBookingFired = true;
            var bookingData = d.data || d.payload || {};
            track('cal_booking_confirmed', {
                cal_event_type: label,
                booking_uid: bookingData.uid || bookingData.bookingId || null,
                event_type_slug: bookingData.eventTypeSlug || bookingData.slug || null
            });
            fbqCustom('CalBookingConfirmed', { cal_event_type: label });
            if (typeof fbq !== 'undefined') {
                try {
                    fbq('track', 'Schedule', {
                        ab_test_name: TEST_NAME,
                        ab_variant: VARIANT,
                        ab_site: 'form'
                    });
                } catch (err) {}
            }
        }
    });

    // ============================================================
    // Engagement: time, scroll, section views, CTAs
    // ============================================================
    function trackEngagement() {
        // Time on page (active tab only)
        var milestones = [
            1, 2, 3, 5, 7, 10, 15, 20, 30, 45, 60, 90, 120
        ];
        var elapsed = 0;
        var nextIndex = 0;
        var timerActive = !document.hidden;

        setInterval(function () {
            if (!timerActive || nextIndex >= milestones.length) return;
            elapsed++;
            if (elapsed >= milestones[nextIndex]) {
                track('ab_time_on_page', { seconds: milestones[nextIndex] });
                nextIndex++;
            }
        }, 1000);

        document.addEventListener('visibilitychange', function () {
            timerActive = !document.hidden;
        });

        // Scroll depth
        var scrollFired = {};
        var scrollThresholds = [25, 50, 75, 100];
        window.addEventListener('scroll', function () {
            var pct = Math.round((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100);
            for (var i = 0; i < scrollThresholds.length; i++) {
                var t = scrollThresholds[i];
                if (pct >= t && !scrollFired[t]) {
                    scrollFired[t] = true;
                    track('ab_scroll_depth', { depth: t });
                }
            }
        }, { passive: true });

        // Section visibility
        var sections = [
            { id: 'hero', name: 'Hero' },
            { id: 'frustration', name: 'Trust & Story' },
            { id: 'how-it-works', name: 'How It Works' },
            { id: 'solution', name: 'Guarantee' },
            { id: 'proof', name: 'Proof' },
            { id: 'faq', name: 'FAQ' }
        ];
        var sectionFired = {};
        sections.forEach(function (sec) {
            var el = document.getElementById(sec.id);
            if (!el) return;
            var fire = function () {
                if (sectionFired[sec.id]) return;
                sectionFired[sec.id] = true;
                track('ab_section_viewed', { section_name: sec.name });
            };
            var rect = el.getBoundingClientRect();
            var vh = window.innerHeight || document.documentElement.clientHeight;
            if (rect.top < vh && rect.bottom > 0) { fire(); return; }
            if (window.IntersectionObserver) {
                var obs = new IntersectionObserver(function (entries) {
                    if (entries[0].isIntersecting) { fire(); obs.disconnect(); }
                }, { threshold: 0.3 });
                obs.observe(el);
            }
        });

        // CTA button clicks
        var ctaButtons = document.querySelectorAll('.btn-primary');
        ctaButtons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var section = btn.closest('section, .sticky-cta, .hero-cta-placeholder, .modal-overlay');
                var location = 'unknown';
                if (section) {
                    if (section.classList.contains('sticky-cta')) location = 'sticky_bar';
                    else if (section.classList.contains('hero-cta-placeholder')) location = 'hero';
                    else if (section.classList.contains('modal-overlay')) location = 'modal';
                    else if (section.id) location = section.id;
                    else if (section.className) location = section.className.split(' ')[0];
                }
                track('ab_cta_click', { cta_location: location });
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', trackEngagement);
    } else {
        trackEngagement();
    }
})();
