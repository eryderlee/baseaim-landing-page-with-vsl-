// Defer the Cal.com iframe until it's actually scrolled into view, then
// pin scroll position briefly around its load event. Cal.com autofocuses
// an internal date-picker when its widget initialises; the browser
// reacts to that focus by scrolling the parent page so the iframe is in
// view, which is what was yanking ad-traffic users down to the booking
// section the moment they tried to scroll.
(function deferCalIframe() {
    function arm() {
        var iframe = document.querySelector('iframe[data-src*="cal.com"]');
        if (!iframe) return;

        var loaded = false;
        function load() {
            if (loaded) return;
            loaded = true;

            var savedY = window.scrollY;
            iframe.src = iframe.getAttribute('data-src');
            iframe.removeAttribute('data-src');

            // For ~1.2s after the iframe finishes loading, hold the page
            // at the user's current scroll position. Defeats Cal.com's
            // focus-induced "scrollIntoView" on the parent. Releases the
            // moment the user actively scrolls.
            iframe.addEventListener('load', function () {
                var deadline = Date.now() + 1200;
                var released = false;
                var release = function () { released = true; };
                ['wheel', 'touchmove', 'keydown'].forEach(function (evt) {
                    window.addEventListener(evt, release, { once: true, passive: true });
                });
                function pin() {
                    if (released || Date.now() > deadline) return;
                    if (Math.abs(window.scrollY - savedY) > 20) {
                        window.scrollTo(0, savedY);
                    }
                    requestAnimationFrame(pin);
                }
                requestAnimationFrame(pin);
            });
        }

        // Only load when the booking section is actually entering the
        // viewport — not on first scroll. By the time it intersects, the
        // user is already near the booking section, so any focus-induced
        // scroll is small and can't yank them away from the hero.
        if (window.IntersectionObserver) {
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        load();
                        observer.disconnect();
                    }
                });
            }, { threshold: 0.05, rootMargin: '0px 0px -150px 0px' });
            observer.observe(iframe);
        } else {
            // Old browsers: just wait for the user to dwell on the page
            setTimeout(load, 12000);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', arm);
    } else {
        arm();
    }
})();

// Render star ratings as inline SVGs with partial fill
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.star-rating[data-rating]').forEach(function(el) {
        var rating = parseFloat(el.dataset.rating) || 0;
        var size = 20;
        var gap = 3;
        var svgWidth = size * 5 + gap * 4;
        var stars = '';
        for (var i = 0; i < 5; i++) {
            var fill = Math.min(Math.max(rating - i, 0), 1);
            var id = 'star-' + Math.random().toString(36).substr(2, 6);
            var x = i * (size + gap);
            stars += '<defs><linearGradient id="' + id + '">' +
                '<stop offset="' + (fill * 100) + '%" stop-color="#f59e0b"/>' +
                '<stop offset="' + (fill * 100) + '%" stop-color="#e2e8f0"/>' +
                '</linearGradient></defs>' +
                '<path transform="translate(' + x + ',0)" d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.49L10 14.27 5.06 16.7 6 11.21 2 7.31l5.53-.8z" fill="url(#' + id + ')"/>';
        }
        el.innerHTML = '<svg width="' + svgWidth + '" height="' + size + '" viewBox="0 0 ' + svgWidth + ' ' + size + '" style="display:block">' + stars + '</svg>';
    });
});

// Smooth scroll to cal.com embed
function scrollToBooking() {
    const calEmbed = document.querySelector('.cal-embed');
    if (calEmbed) {
        calEmbed.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        const bookingSection = document.getElementById('booking');
        if (bookingSection) {
            bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

// Smooth scroll to VSL section
function scrollToVSL() {
    const vslSection = document.getElementById('vsl');
    if (vslSection) {
        vslSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// FAQ Accordion functionality
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            // Close other open items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
        });
    });
});

// Sticky CTA visibility
let lastScrollTop = 0;
const stickyCTA = document.getElementById('sticky-cta');
const bookingSection = document.getElementById('booking');

function updateStickyCTAHeight() {
    if (!stickyCTA) {
        return;
    }
    const height = stickyCTA.getBoundingClientRect().height || stickyCTA.offsetHeight || 0;
    document.documentElement.style.setProperty('--sticky-cta-height', `${Math.ceil(height)}px`);
}

updateStickyCTAHeight();
window.addEventListener('resize', updateStickyCTAHeight);
window.addEventListener('orientationchange', updateStickyCTAHeight);

// Initialize sticky CTA styles - visible by default
if (stickyCTA) {
    stickyCTA.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    stickyCTA.style.transform = 'translateY(0)';
    stickyCTA.style.opacity = '1';
}

window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const bookingSectionTop = bookingSection.offsetTop;
    const windowHeight = window.innerHeight;

    // Hide sticky CTA only when user reaches the booking section
    if ((scrollTop + windowHeight) >= bookingSectionTop) {
        stickyCTA.style.transform = 'translateY(100%)';
        stickyCTA.style.opacity = '0';
    } else {
        stickyCTA.style.transform = 'translateY(0)';
        stickyCTA.style.opacity = '1';
    }
}, { passive: true });

// Track scroll depth for analytics (optional)
let maxScrollDepth = 0;

window.addEventListener('scroll', function() {
    const scrollPercentage = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100;

    if (scrollPercentage > maxScrollDepth) {
        maxScrollDepth = Math.round(scrollPercentage);

        // You can send this to your analytics platform
        // Example: gtag('event', 'scroll_depth', { value: maxScrollDepth });
    }
}, { passive: true });

// Intersection Observer for scroll animations (optional enhancement)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe sections for fade-in effect
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });
});

// Video play tracking (optional for analytics)
document.addEventListener('DOMContentLoaded', function() {
    const videoIframes = document.querySelectorAll('iframe[src*="youtube"]');

    videoIframes.forEach(iframe => {
        iframe.addEventListener('load', function() {
            // Track video load if needed
            console.log('Video loaded');
        });
    });
});

// Form validation helper for Cal.com embed (if custom fields are added)
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Prevent orphaned text on mobile (optional typography enhancement)
function preventOrphans() {
    const headlines = document.querySelectorAll('h1, h2, h3');

    headlines.forEach(headline => {
        const text = headline.innerHTML;
        const lastSpace = text.lastIndexOf(' ');

        if (lastSpace !== -1) {
            const newText = text.substring(0, lastSpace) + '&nbsp;' + text.substring(lastSpace + 1);
            headline.innerHTML = newText;
        }
    });
}

// Run typography enhancements on load
document.addEventListener('DOMContentLoaded', function() {
    if (window.innerWidth <= 640) {
        preventOrphans();
    }
});

// Handle external link clicks (if any are added later)
document.addEventListener('DOMContentLoaded', function() {
    const externalLinks = document.querySelectorAll('a[href^="http"]');

    externalLinks.forEach(link => {
        if (!link.href.includes(window.location.hostname)) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });
});

// Lazy load videos when in viewport (performance optimization)
document.addEventListener('DOMContentLoaded', function() {
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const iframe = entry.target;
                if (iframe.dataset.src) {
                    iframe.src = iframe.dataset.src;
                    iframe.removeAttribute('data-src');
                    videoObserver.unobserve(iframe);
                }
            }
        });
    }, {
        rootMargin: '200px'
    });

    // Skip the Cal.com iframe — deferCalIframe() above handles it with a
    // scroll-pin around its load event. Letting this generic observer also
    // claim it caused a race where the wider rootMargin loaded the iframe
    // first and bypassed the pin.
    const lazyVideos = document.querySelectorAll('iframe[data-src]:not([data-src*="cal.com"])');
    lazyVideos.forEach(video => {
        videoObserver.observe(video);
    });
});

// Custom hero video controls with faux slider timing
document.addEventListener('DOMContentLoaded', function() {
    const heroVideo = document.getElementById('hero-vsl');
    const customControls = document.querySelector('.custom-video-ui');

    if (!heroVideo || !customControls) {
        return;
    }

    const INITIAL_PROGRESS = 0;
    const videoWrapper = heroVideo.closest('.video-wrapper');
    const playToggle = customControls.querySelector('.video-play-toggle');
    const volumeControl = customControls.querySelector('.video-volume');
    const volumeToggle = volumeControl ? volumeControl.querySelector('.video-volume-toggle') : null;
    const volumeSlider = volumeControl ? volumeControl.querySelector('input[type="range"]') : null;
    const overlayPlayButton = videoWrapper ? videoWrapper.querySelector('.video-centered-play') : null;
    const progressBar = customControls.querySelector('.video-progress');
    const progressFill = customControls.querySelector('.video-progress-fill');
    let rafId = null;
    let hideControlsTimeout = null;
    let hasStarted = false;
    const CONTROLS_HIDE_DELAY = 15000;
    let lastNonZeroVolume = heroVideo.volume > 0 ? heroVideo.volume : 0.75;

    const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);

    const setProgress = (ratio) => {
        const clamped = clamp(ratio);
        if (progressFill) {
            progressFill.style.width = `${(clamped * 100).toFixed(2)}%`;
        }
        if (progressBar) {
            progressBar.setAttribute('aria-valuenow', String(Math.round(clamped * 100)));
        }
    };

    const calculateFauxProgress = (currentTime, duration) => {
        if (!duration || duration === Infinity) {
            return INITIAL_PROGRESS;
        }

        const safeTime = clamp(currentTime, 0, duration);
        // Bar finishes 20s before video ends
        const barEndTime = Math.max(duration - 20, duration * 0.8);

        if (safeTime <= 0) {
            return INITIAL_PROGRESS;
        }

        if (safeTime >= barEndTime) {
            return 1;
        }

        // Two-phase slider:
        const halfTime = barEndTime * 0.05;  // first half fills in 15% of total time (CHANGE THIS to speed up/slow down first half)
        const ratio = safeTime / barEndTime;

        if (safeTime <= halfTime) {
            // First half: fast — reaches 50% by halfTime
            return (safeTime / halfTime) * 0.5;
        } else {
            // Three sub-phases after the fast start:
            const remaining = barEndTime - halfTime;
            const elapsed = safeTime - halfTime;
            const secondRatio = elapsed / remaining;

            // 50% → 95%: steady moderate speed
            const crawlStart = 0.3; // ratio at which crawl begins (30% of remaining time)
            if (secondRatio <= crawlStart) {
                return 0.5 + (secondRatio / crawlStart) * 0.45; // 50% to 95%
            } else {
                // 95% → 100%: crawl to finish
                const crawlRatio = (secondRatio - crawlStart) / (1 - crawlStart);
                return 0.95 + crawlRatio * 0.05;
            }
        }
    };

    const updateButtonState = () => {
        if (!playToggle) {
            return;
        }

        const isPaused = heroVideo.paused || heroVideo.ended;
        playToggle.dataset.state = isPaused ? 'play' : 'pause';
        playToggle.setAttribute('aria-label', isPaused ? 'Play video' : 'Stop video');
    };

    const clearHideControlsTimeout = () => {
        if (hideControlsTimeout) {
            clearTimeout(hideControlsTimeout);
            hideControlsTimeout = null;
        }
    };

    const hideControls = () => {
        if (!videoWrapper || heroVideo.paused || heroVideo.ended) {
            return;
        }
        videoWrapper.classList.add('hide-controls');
    };

    const scheduleHideControls = () => {
        clearHideControlsTimeout();
        if (heroVideo.paused || heroVideo.ended) {
            return;
        }
        hideControlsTimeout = setTimeout(hideControls, CONTROLS_HIDE_DELAY);
    };

    const showControls = (autoHide = true) => {
        if (!videoWrapper) {
            return;
        }
        videoWrapper.classList.remove('hide-controls');
        if (autoHide) {
            scheduleHideControls();
        } else {
            clearHideControlsTimeout();
        }
    };

    const setOverlayVisibility = (shouldShow) => {
        if (!videoWrapper) {
            return;
        }
        if (shouldShow) {
            videoWrapper.classList.add('show-play-overlay');
        } else {
            videoWrapper.classList.remove('show-play-overlay');
        }
    };

    const updateProgressDisplay = () => {
        const fauxRatio = heroVideo.ended ? 1 : calculateFauxProgress(heroVideo.currentTime, heroVideo.duration);
        setProgress(fauxRatio);
    };

    const animateProgress = () => {
        updateProgressDisplay();

        if (!heroVideo.paused && !heroVideo.ended) {
            rafId = requestAnimationFrame(animateProgress);
        }
    };

    const stopProgressAnimation = () => {
        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    };

    const toggleVideoPlayback = () => {
        if (heroVideo.paused || heroVideo.ended) {
            const playPromise = heroVideo.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => {
                    // Mobile may block unmuted playback; retry muted
                    heroVideo.muted = true;
                    heroVideo.play().then(() => {
                        syncVolumeUI();
                    }).catch(() => {});
                });
            }
        } else {
            heroVideo.pause();
        }
    };

    const syncVolumeUI = () => {
        if (volumeToggle) {
            const isMuted = heroVideo.muted || heroVideo.volume === 0;
            volumeToggle.dataset.muted = isMuted ? 'true' : 'false';
            volumeToggle.setAttribute('aria-label', isMuted ? 'Unmute video' : 'Mute video');
        }

        if (volumeSlider) {
            const value = heroVideo.muted ? 0 : heroVideo.volume;
            volumeSlider.value = clamp(value, 0, 1).toFixed(2);
        }
    };

    const handleVolumeInput = (event) => {
        const inputValue = parseFloat(event.target.value);
        if (Number.isNaN(inputValue)) {
            return;
        }
        const clampedValue = clamp(inputValue, 0, 1);
        heroVideo.volume = clampedValue;
        heroVideo.muted = clampedValue === 0;
        if (clampedValue > 0) {
            lastNonZeroVolume = clampedValue;
        }
        syncVolumeUI();
    };

    const exitIntroState = () => {
        if (!videoWrapper || hasStarted) {
            return;
        }
        hasStarted = true;
        videoWrapper.classList.remove('intro-state');
        videoWrapper.classList.remove('show-play-overlay');
    };

    const handleActivePointer = () => {
        showControls(true);
    };

    if (videoWrapper) {
        videoWrapper.addEventListener('mousemove', handleActivePointer);
        videoWrapper.addEventListener('pointerdown', handleActivePointer);
        videoWrapper.addEventListener('touchstart', handleActivePointer, { passive: true });
        videoWrapper.addEventListener('mouseleave', () => {
            if (!heroVideo.paused) {
                scheduleHideControls();
            }
        });
    }

    heroVideo.controls = false;
    setProgress(INITIAL_PROGRESS);
    updateButtonState();
    showControls(false);
    syncVolumeUI();

    heroVideo.addEventListener('playing', () => {
        exitIntroState();
        updateButtonState();
        stopProgressAnimation();
        animateProgress();
        showControls(true);
        setOverlayVisibility(false);
    });

    heroVideo.addEventListener('pause', () => {
        updateButtonState();
        stopProgressAnimation();
        updateProgressDisplay();
        showControls(false);
        if (hasStarted && !heroVideo.ended) {
            setOverlayVisibility(true);
        }
    });

    heroVideo.addEventListener('ended', () => {
        stopProgressAnimation();
        setProgress(1);
        updateButtonState();
        showControls(false);
        setOverlayVisibility(true);
    });

    heroVideo.addEventListener('timeupdate', updateProgressDisplay);
    heroVideo.addEventListener('loadedmetadata', () => {
        setProgress(INITIAL_PROGRESS);
        updateProgressDisplay();
        showControls(false);
        syncVolumeUI();
    });
    heroVideo.addEventListener('volumechange', () => {
        if (!heroVideo.muted && heroVideo.volume > 0) {
            lastNonZeroVolume = heroVideo.volume;
        }
        syncVolumeUI();
    });

    videoWrapper.addEventListener('click', (event) => {
        if (event.target === heroVideo || event.target === videoWrapper) {
            toggleVideoPlayback();
        }
    });
    heroVideo.addEventListener('keydown', (event) => {
        if (event.code === 'Space' || event.code === 'Enter') {
            event.preventDefault();
            toggleVideoPlayback();
        }
        showControls(true);
    });

    if (playToggle) {
        playToggle.addEventListener('click', (event) => {
            event.stopPropagation();
            toggleVideoPlayback();
            showControls(true);
        });
    }

    if (volumeSlider) {
        volumeSlider.addEventListener('input', (event) => {
            event.stopPropagation();
            handleVolumeInput(event);
            showControls(true);
        });

        volumeSlider.addEventListener('change', handleVolumeInput);
    }

    if (volumeToggle) {
        volumeToggle.addEventListener('click', (event) => {
            event.stopPropagation();
            const isMuted = heroVideo.muted || heroVideo.volume === 0;
            if (isMuted) {
                const restoredVolume = lastNonZeroVolume > 0 ? lastNonZeroVolume : 0.75;
                heroVideo.volume = clamp(restoredVolume, 0, 1);
                heroVideo.muted = false;
            } else {
                heroVideo.muted = true;
            }
            syncVolumeUI();
            showControls(true);
        });
    }

    let handledByTouch = false;

    const handleOverlayTouch = (event) => {
        event.stopPropagation();
        event.preventDefault();
        handledByTouch = true;
        toggleVideoPlayback();
    };

    const handleOverlayClick = (event) => {
        event.stopPropagation();
        if (handledByTouch) {
            handledByTouch = false;
            return;
        }
        toggleVideoPlayback();
    };

    if (overlayPlayButton) {
        overlayPlayButton.addEventListener('touchend', handleOverlayTouch);
        overlayPlayButton.addEventListener('click', handleOverlayClick);
    }

    const overlayDiv = videoWrapper ? videoWrapper.querySelector('.video-overlay-play') : null;
    if (overlayDiv) {
        overlayDiv.addEventListener('touchend', handleOverlayTouch);
        overlayDiv.addEventListener('click', handleOverlayClick);
    }

    const fullscreenToggle = customControls.querySelector('.video-fullscreen-toggle');
    if (fullscreenToggle) {
        fullscreenToggle.addEventListener('click', (event) => {
            event.stopPropagation();
            const wrapper = heroVideo.closest('.video-wrapper');
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else if (wrapper && wrapper.requestFullscreen) {
                wrapper.requestFullscreen();
            } else if (heroVideo.webkitEnterFullscreen) {
                heroVideo.webkitEnterFullscreen();
            }
            showControls(true);
        });
    }
});

// Sticky video functionality - minimizes to corner when scrolled past
document.addEventListener('DOMContentLoaded', function() {
    const heroVideoSection = document.querySelector('.hero-video');
    const videoWrapper = heroVideoSection ? heroVideoSection.querySelector('.video-wrapper') : null;
    const mediaElement = videoWrapper ? videoWrapper.querySelector('iframe, video') : null;

    if (!heroVideoSection || !videoWrapper || !mediaElement) {
        return;
    }

    // Inject a dismiss button so users can close the floating player
    const closeBtn = document.createElement('button');
    closeBtn.className = 'sticky-video-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label', 'Close mini player');
    videoWrapper.appendChild(closeBtn);

    // Placeholder maintains layout height when the player becomes fixed
    const placeholder = document.createElement('div');
    const initialVideoHeight = videoWrapper.getBoundingClientRect().height || videoWrapper.offsetHeight || 0;
    placeholder.style.width = '100%';
    placeholder.style.height = initialVideoHeight + 'px';
    placeholder.style.display = 'none';
    videoWrapper.parentNode.insertBefore(placeholder, videoWrapper);
    const originalParent = placeholder.parentNode;

    let stickyDismissed = false;

    closeBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        stickyDismissed = true;
        videoWrapper.classList.remove('sticky');
        placeholder.style.display = 'none';
        document.body.style.overflowX = '';
        if (videoWrapper.parentElement !== originalParent) {
            originalParent.insertBefore(videoWrapper, placeholder.nextSibling);
        }
    });

    const updatePlaceholderHeight = () => {
        const currentHeight = videoWrapper.classList.contains('sticky')
            ? initialVideoHeight
            : videoWrapper.getBoundingClientRect().height || initialVideoHeight;
        placeholder.style.height = currentHeight + 'px';
    };

    const toggleSticky = () => {
        const heroRect = heroVideoSection.getBoundingClientRect();

        if (heroRect.bottom <= 0) {
            if (!stickyDismissed) {
                if (videoWrapper.parentElement !== document.body) {
                    document.body.appendChild(videoWrapper);
                }
                videoWrapper.classList.add('sticky');
                placeholder.style.display = 'block';
                document.body.style.overflowX = 'hidden';
            }
        } else {
            if (videoWrapper.classList.contains('sticky')) {
                videoWrapper.classList.remove('sticky');
                placeholder.style.display = 'none';
                if (videoWrapper.parentElement !== originalParent) {
                    originalParent.insertBefore(videoWrapper, placeholder.nextSibling);
                }
                document.body.style.overflowX = '';
                stickyDismissed = false;
            }
        }
    };

    window.addEventListener('scroll', toggleSticky, { passive: true });
    window.addEventListener('resize', () => {
        updatePlaceholderHeight();
        toggleSticky();
    });

    updatePlaceholderHeight();
    toggleSticky();
});

// Console message for developers
console.log('%cBaseaim Landing Page', 'color: #2563eb; font-size: 20px; font-weight: bold;');
console.log('%cBuilt for high conversion', 'color: #64748b; font-size: 14px;');
