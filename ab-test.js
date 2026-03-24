/**
 * Baseaim A/B Testing Engine
 * Lightweight client-side A/B testing for headline + VSL video
 * Integrates with GTM and Meta Pixel
 */
(function () {
    'use strict';

    // =============================================
    // TEST CONFIGURATION — Edit your variants here
    // =============================================
    var TESTS = {
        headline: {
            A: {
                html: '<span style="font-size:2rem;">Accountants</span> <br> <span class="headline-highlight listen-up-highlight" style="font-size:1.9rem">Listen <span id="secret-p" style="cursor:default">up</span></span><br><br><strong>THREE</strong> new clients <br> every single month<span class="headline-br-mid" style="display:block;"></span><span class="headline-highlight" style="font-size:2.55rem"> Or you Don\'t Pay</span>',
                version: 'control'
            },
            B: {
                // REPLACE with your variant B headline
                html: 'Get <span class="headline-highlight">Garunteed results...</span> or you<span class="headline-highlight"> Don\'t Pay Us</span>',
                version: 'variant_b'
            }
        },
        subheadline: {
            A: {
                html: '',
                version: 'control'
            },
            B: {
                html: 'Only for Australian Accounting Firms',
                version: 'variant_b'
            }
        },
        vsl: {
            A: {
                src: 'final-vsl.mp4',
                poster: 'thumbnail 2.png',
                version: 'control'
            },
            B: {
                // REPLACE with your variant B video file and poster
                src: 'vsl mp4.mp4',
                poster: 'thumbnail 2.png',
                version: 'variant_b'
            }
        }
    };

    // =============================================
    // ANTI-FLICKER — hide elements until variant is applied
    // =============================================
    var antiFlicker = document.createElement('style');
    antiFlicker.textContent = '.headline, .video-intro, .hero-video video { opacity: 0 !important; }';
    document.head.appendChild(antiFlicker);

    // =============================================
    // VARIANT ASSIGNMENT — locked to A, tracking still active
    // =============================================
    var variant = 'A';
    localStorage.setItem('ab_variant', variant);
    localStorage.setItem('ab_variant_time', new Date().toISOString());

    // =============================================
    // APPLY VARIANTS
    // =============================================
    function applyVariants() {
        var headline = document.querySelector('h1.headline');
        if (headline) {
            headline.innerHTML = TESTS.headline[variant].html;
        }

        var subheadline = document.querySelector('p.video-intro');
        if (subheadline) {
            subheadline.innerHTML = TESTS.subheadline[variant].html;
        }

        var video = document.querySelector('.hero-video video');
        var source = video ? video.querySelector('source') : null;
        if (video && source) {
            var newSrc = new URL(TESTS.vsl[variant].src, document.baseURI).href;
            if (source.src !== newSrc) {
                source.src = TESTS.vsl[variant].src;
                video.load();
            }
            video.poster = TESTS.vsl[variant].poster;
        }

        // Remove anti-flicker
        antiFlicker.remove();
    }

    // =============================================
    // ANALYTICS — GTM + Meta Pixel
    // =============================================
    function trackAssignment() {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: 'ab_test_assigned',
            ab_test_name: 'headline_vsl_test',
            ab_test_variant: variant,
            ab_headline_version: TESTS.headline[variant].version,
            ab_vsl_version: TESTS.vsl[variant].version
        });

        if (typeof fbq !== 'undefined') {
            fbq('trackCustom', 'ABTestAssigned', {
                test_name: 'headline_vsl_test',
                variant: variant
            });
        }
    }

    // =============================================
    // CONVERSION PROXY — booking section + Cal.com URL param
    // =============================================
    function setupConversionTracking() {
        // Append variant as Cal.com metadata so it appears in webhook payload.metadata
        var calIframe = document.querySelector('iframe[src*="cal.com"]');
        if (calIframe) {
            var src = calIframe.getAttribute('src');
            var sep = src.indexOf('?') !== -1 ? '&' : '?';
            calIframe.setAttribute('src', src + sep + 'metadata[ab_variant]=' + variant);
        }

        // Track when users scroll to booking section
        var bookingSection = document.getElementById('booking');
        if (bookingSection && window.IntersectionObserver) {
            var observer = new IntersectionObserver(function (entries) {
                if (entries[0].isIntersecting) {
                    observer.disconnect();
                    window.dataLayer = window.dataLayer || [];
                    window.dataLayer.push({
                        event: 'booking_section_viewed',
                        ab_test_variant: variant
                    });
                }
            }, { threshold: 0.3 });
            observer.observe(bookingSection);
        }
    }

    // =============================================
    // ENGAGEMENT TRACKING — time, scroll, video
    // =============================================
    function trackEngagement() {
        // --- Time on page (active tab only) ---
        var milestones = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 30, 60, 120];
        var elapsed = 0;
        var nextIndex = 0;
        var timerActive = !document.hidden;

        setInterval(function () {
            if (!timerActive || nextIndex >= milestones.length) return;
            elapsed++;
            if (elapsed >= milestones[nextIndex]) {
                window.dataLayer.push({
                    event: 'ab_time_on_page',
                    seconds: milestones[nextIndex],
                    ab_test_variant: variant
                });
                nextIndex++;
            }
        }, 1000);

        document.addEventListener('visibilitychange', function () {
            timerActive = !document.hidden;
        });

        // --- Scroll depth milestones (percentage) ---
        var scrollFired = {};
        var scrollThresholds = [25, 50, 75, 100];

        window.addEventListener('scroll', function () {
            var pct = Math.round((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100);
            for (var i = 0; i < scrollThresholds.length; i++) {
                var t = scrollThresholds[i];
                if (pct >= t && !scrollFired[t]) {
                    scrollFired[t] = true;
                    window.dataLayer.push({
                        event: 'ab_scroll_depth',
                        depth: t,
                        ab_test_variant: variant
                    });
                }
            }
        }, { passive: true });

        // --- Section visibility tracking ---
        var sections = [
            { id: 'hero', name: 'Hero' },
            { id: 'frustration', name: 'Trust & Story' },
            { id: 'how-it-works', name: 'How It Works' },
            { id: 'solution', name: 'Guarantee' },
            { id: 'proof', name: 'Proof' },
            { id: 'faq', name: 'FAQ' },
            { id: 'booking', name: 'Booking' }
        ];
        var sectionFired = {};

        sections.forEach(function (sec) {
            var el = document.getElementById(sec.id);
            if (el && window.IntersectionObserver) {
                var obs = new IntersectionObserver(function (entries) {
                    if (entries[0].isIntersecting && !sectionFired[sec.id]) {
                        sectionFired[sec.id] = true;
                        window.dataLayer.push({
                            event: 'ab_section_viewed',
                            section_name: sec.name,
                            ab_test_variant: variant
                        });
                        obs.disconnect();
                    }
                }, { threshold: 0.3 });
                obs.observe(el);
            }
        });

        // --- Video engagement ---
        var video = document.querySelector('.hero-video video');
        if (video) {
            var videoFired = {};

            video.addEventListener('play', function () {
                if (!videoFired.play) {
                    videoFired.play = true;
                    window.dataLayer.push({
                        event: 'ab_video_engagement',
                        action: 'play',
                        ab_test_variant: variant
                    });
                }
            });

            video.addEventListener('timeupdate', function () {
                if (!video.duration) return;
                var pct = Math.round(video.currentTime / video.duration * 100);
                var checkpoints = [1, 2, 3, 4, 5, 10, 15, 20, 25, 50, 75];
                for (var i = 0; i < checkpoints.length; i++) {
                    var cp = checkpoints[i];
                    if (pct >= cp && !videoFired['progress_' + cp]) {
                        videoFired['progress_' + cp] = true;
                        window.dataLayer.push({
                            event: 'ab_video_engagement',
                            action: 'progress_' + cp,
                            ab_test_variant: variant
                        });
                    }
                }
            });

            video.addEventListener('ended', function () {
                if (!videoFired.complete) {
                    videoFired.complete = true;
                    window.dataLayer.push({
                        event: 'ab_video_engagement',
                        action: 'complete',
                        ab_test_variant: variant
                    });
                }
            });
        }
    }

    // =============================================
    // INIT
    // =============================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            applyVariants();
            trackAssignment();
            setupConversionTracking();
            trackEngagement();
        });
    } else {
        applyVariants();
        trackAssignment();
        setupConversionTracking();
        trackEngagement();
    }

    // =============================================
    // DEBUG HELPER — use in browser console
    // =============================================
    window.BASEAIM_AB_TEST = {
        variant: variant,
        reset: function () {
            localStorage.removeItem('ab_variant');
            localStorage.removeItem('ab_variant_time');
            location.reload();
        }
    };
})();
