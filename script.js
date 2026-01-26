// Smooth scroll to booking section
function scrollToBooking() {
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

    const lazyVideos = document.querySelectorAll('iframe[data-src]');
    lazyVideos.forEach(video => {
        videoObserver.observe(video);
    });
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
            }
        } else {
            videoWrapper.classList.remove('sticky');
            placeholder.style.display = 'none';
            if (videoWrapper.parentElement !== originalParent) {
                originalParent.insertBefore(videoWrapper, placeholder.nextSibling);
            }
            stickyDismissed = false;
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
