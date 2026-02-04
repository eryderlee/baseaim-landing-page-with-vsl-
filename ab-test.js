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
                html: 'Get <span class="headline-highlight">5 Booked Calls</span> Every Month — <span class="headline-highlight">Or Don\'t Pay Us</span>',
                version: 'control'
            },
            B: {
                // REPLACE with your variant B headline
                html: 'Your New Headline <span class="headline-highlight">Highlighted Part</span>',
                version: 'variant_b'
            }
        },
        vsl: {
            A: {
                src: 'vsl mp4.mp4',
                poster: 'hero-poster.jpeg',
                version: 'control'
            },
            B: {
                // REPLACE with your variant B video file and poster
                src: 'vsl-variant-b.mp4',
                poster: 'hero-poster-b.jpeg',
                version: 'variant_b'
            }
        }
    };

    // =============================================
    // ANTI-FLICKER — hide elements until variant is applied
    // =============================================
    var antiFlicker = document.createElement('style');
    antiFlicker.textContent = '.headline, .hero-video video { opacity: 0 !important; }';
    document.head.appendChild(antiFlicker);

    // =============================================
    // VARIANT ASSIGNMENT — 50/50 split, persistent
    // =============================================
    var variant = localStorage.getItem('ab_variant');
    if (!variant) {
        variant = crypto.getRandomValues(new Uint32Array(1))[0] % 2 === 0 ? 'A' : 'B';
        localStorage.setItem('ab_variant', variant);
        localStorage.setItem('ab_variant_time', new Date().toISOString());
    }

    // =============================================
    // APPLY VARIANTS
    // =============================================
    function applyVariants() {
        var headline = document.querySelector('h1.headline');
        if (headline) {
            headline.innerHTML = TESTS.headline[variant].html;
        }

        var video = document.querySelector('.hero-video video');
        var source = video ? video.querySelector('source') : null;
        if (video && source) {
            source.src = TESTS.vsl[variant].src;
            video.poster = TESTS.vsl[variant].poster;
            video.load();
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
        var milestones = [1, 5, 10, 15, 30, 60, 120];
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

        // --- Scroll depth milestones ---
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
                var checkpoints = [25, 50, 75];
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
