/**
 * Baseaim A/B Tracker — VSL site
 *
 * Reads the variant assignment from window.BASEAIM_AB (set by ab-router.js)
 * and pushes engagement + conversion events to dataLayer (for GTM/GA4) and
 * Meta Pixel, all tagged with ab_variant so the two sites can be compared.
 *
 * The router handles the actual variant assignment and any redirect. By the
 * time this runs, the visitor is on the correct site for their variant.
 */
(function () {
    'use strict';

    var AB = window.BASEAIM_AB || { testName: 'vsl_vs_form', variant: 'vsl', site: 'vsl', source: 'fallback' };
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
            ab_site: 'vsl'
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
            ab_site: 'vsl'
        };
        if (props) for (var k in props) if (Object.prototype.hasOwnProperty.call(props, k)) payload[k] = props[k];
        try { fbq('trackCustom', name, payload); } catch (e) {}
    }

    // ============================================================
    // Assignment fire (every pageview, so GA4 sees the dimension)
    // ============================================================
    track('ab_test_assigned', { ab_assignment_source: AB.source });
    fbqCustom('ABTestAssigned', { source: AB.source });

    // ============================================================
    // Cal.com — propagate variant as booking metadata
    //
    // Two paths cover both the legacy raw-iframe embed and the current
    // official Cal.com inline embed (mounted by script.js's
    // deferCalInlineEmbed, which reads the variant from localStorage).
    // The router writes the variant to localStorage on every visit.
    // ============================================================
    function tagCalEmbed() {
        var calIframe = document.querySelector('iframe[src*="cal.com"]');
        if (!calIframe) return;
        var src = calIframe.getAttribute('src');
        if (src.indexOf('metadata%5Bab_variant%5D=') !== -1 || src.indexOf('metadata[ab_variant]=') !== -1) return;
        var sep = src.indexOf('?') !== -1 ? '&' : '?';
        calIframe.setAttribute('src', src + sep + 'metadata[ab_variant]=' + VARIANT);
    }

    // ============================================================
    // Cal.com booking confirmation — listen for postMessage from iframe
    //
    // Cal.com's embed iframe broadcasts events via window.postMessage. Naming
    // has varied over versions, so we match defensively on type/action +
    // booking + success/complete/confirmed. Fires once per pageview.
    // ============================================================
    var calBookingFired = false;
    function trackCalBookings() {
        window.addEventListener('message', function (e) {
            if (!e || !e.origin) return;
            if (e.origin.indexOf('cal.com') === -1) return;
            var d = e.data;
            if (!d || (typeof d !== 'object' && typeof d !== 'string')) return;

            // Cal sometimes ships JSON strings, sometimes objects.
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
                // Also fire as standard Meta Pixel Schedule event for ads optimization.
                if (typeof fbq !== 'undefined') {
                    try {
                        fbq('track', 'Schedule', {
                            ab_test_name: TEST_NAME,
                            ab_variant: VARIANT,
                            ab_site: 'vsl'
                        });
                    } catch (err) {}
                }
            }
        });
    }

    // ============================================================
    // Booking section visibility = soft lead signal
    // ============================================================
    function trackBookingSectionView() {
        var bookingSection = document.getElementById('book-call-section') || document.getElementById('booking');
        if (!bookingSection || !window.IntersectionObserver) return;
        var observer = new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting) {
                observer.disconnect();
                track('booking_section_viewed');
                fbqCustom('BookingSectionViewed');
            }
        }, { threshold: 0.3 });
        observer.observe(bookingSection);
    }

    // ============================================================
    // Engagement: time on page, scroll depth, section views, video, CTAs
    // ============================================================
    function trackEngagement() {
        // Time on page (active tab only)
        var milestones = [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
            11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
            21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
            45, 60, 90, 120
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
            { id: 'faq', name: 'FAQ' },
            { id: 'book-call-section', name: 'Booking' }
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

        // Video engagement
        var video = document.querySelector('.hero-video video');
        if (video) {
            var videoFired = {};
            video.addEventListener('play', function () {
                if (videoFired.play) return;
                videoFired.play = true;
                track('ab_video_engagement', { action: 'play' });
            });
            video.addEventListener('timeupdate', function () {
                var sec = Math.floor(video.currentTime);
                if (sec < 1) return;
                var checkpoints = [], i;
                for (i = 1; i <= 30; i++) checkpoints.push(i);
                for (i = 35; i <= 115; i += 5) checkpoints.push(i);
                for (i = 0; i < checkpoints.length; i++) {
                    var cp = checkpoints[i];
                    if (sec >= cp && !videoFired['sec_' + cp]) {
                        videoFired['sec_' + cp] = true;
                        track('ab_video_engagement', { action: 'second_' + cp });
                    }
                }
            });
            video.addEventListener('ended', function () {
                if (videoFired.complete) return;
                videoFired.complete = true;
                track('ab_video_engagement', { action: 'complete' });
            });
        }

        // CTA button clicks
        var ctaButtons = document.querySelectorAll('.btn-primary');
        ctaButtons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var section = btn.closest('section, .sticky-cta, .hero-cta-desktop, .hero-cta-mobile');
                var location = 'unknown';
                if (section) {
                    if (section.classList.contains('sticky-cta')) location = 'sticky_bar';
                    else if (section.classList.contains('hero-cta-desktop')) location = 'hero_desktop';
                    else if (section.classList.contains('hero-cta-mobile')) location = 'hero_mobile';
                    else if (section.id) location = section.id;
                    else if (section.className) location = section.className.split(' ')[0];
                }
                track('ab_cta_click', { cta_location: location });
            });
        });
    }

    // ============================================================
    // INIT
    // ============================================================
    function init() {
        tagCalEmbed();
        trackBookingSectionView();
        trackCalBookings();
        trackEngagement();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
