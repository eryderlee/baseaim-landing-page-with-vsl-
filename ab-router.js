/**
 * Baseaim A/B Site Router — path-based
 *
 * 50/50 sticky split between the VSL variant (served at /) and the Form
 * variant (served at /form/). Runs before any other script in <head>. If the
 * visitor's assignment doesn't match the path they landed on, redirects
 * (preserving query string and hash) to the matching variant.
 *
 * Drop this into BOTH ab-router.js copies. The only thing that changes
 * per-page is the THIS_SITE constant directly below.
 *
 * Override hooks (for QA + ad campaigns):
 *   ?force=vsl    -> pin variant to VSL for this visit + persist
 *   ?force=form   -> pin variant to form for this visit + persist
 *   ?nosplit=1    -> skip routing entirely on this pageview (don't persist)
 */
(function () {
    'use strict';

    // ============================================================
    // PER-PAGE CONFIG — change this one line per copy
    // ============================================================
    var THIS_SITE = 'vsl'; // 'vsl' at /index.html, 'form' at /form/index.html

    // Path each variant lives at (both same-origin).
    var PATHS = {
        vsl:  '/',
        form: '/form/'
    };

    var TEST_NAME = 'vsl_vs_form';
    var STORAGE_KEY = 'baseaim_page_variant';
    var COOKIE_NAME = 'baseaim_page_variant';
    var COOKIE_MAX_AGE_DAYS = 30;

    // ============================================================
    // ANTI-FLICKER — hide page until routing decision is made
    // ============================================================
    var flicker = document.createElement('style');
    flicker.id = 'ab-router-flicker';
    flicker.textContent = 'html{visibility:hidden!important}';
    (document.head || document.documentElement).appendChild(flicker);

    function liftFlicker() {
        var el = document.getElementById('ab-router-flicker');
        if (el) el.parentNode.removeChild(el);
    }

    // ============================================================
    // Helpers
    // ============================================================
    function getParam(name) {
        var m = window.location.search.match(new RegExp('[?&]' + name + '=([^&#]*)'));
        return m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : null;
    }

    function readCookie(name) {
        var parts = (document.cookie || '').split(';');
        for (var i = 0; i < parts.length; i++) {
            var p = parts[i].replace(/^\s+/, '');
            if (p.indexOf(name + '=') === 0) return decodeURIComponent(p.substring(name.length + 1));
        }
        return null;
    }

    function writeCookie(name, value) {
        var maxAge = COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
        var parts = [
            name + '=' + encodeURIComponent(value),
            'path=/',
            'max-age=' + maxAge,
            'samesite=lax'
        ];
        if (location.protocol === 'https:') parts.push('secure');
        document.cookie = parts.join('; ');
    }

    function persistVariant(variant) {
        try { localStorage.setItem(STORAGE_KEY, variant); } catch (e) {}
        try { localStorage.setItem(STORAGE_KEY + '_time', new Date().toISOString()); } catch (e) {}
        writeCookie(COOKIE_NAME, variant);
    }

    function readStoredVariant() {
        try {
            var v = localStorage.getItem(STORAGE_KEY);
            if (v === 'vsl' || v === 'form') return v;
        } catch (e) {}
        var c = readCookie(COOKIE_NAME);
        if (c === 'vsl' || c === 'form') return c;
        return null;
    }

    // ============================================================
    // Assignment
    // ============================================================
    var nosplit = getParam('nosplit');
    var forced  = getParam('force');

    var variant;
    var assignmentSource;

    if (nosplit === '1' || nosplit === 'true') {
        variant = THIS_SITE;
        assignmentSource = 'nosplit';
    } else if (forced === 'vsl' || forced === 'form') {
        variant = forced;
        assignmentSource = 'forced';
        persistVariant(variant);
    } else {
        var stored = readStoredVariant();
        if (stored) {
            variant = stored;
            assignmentSource = 'returning';
        } else {
            variant = Math.random() < 0.5 ? 'vsl' : 'form';
            assignmentSource = 'new_assignment';
            persistVariant(variant);
        }
    }

    // ============================================================
    // Redirect if needed (preserving query string + hash)
    // ============================================================
    if (variant !== THIS_SITE && PATHS[variant]) {
        var target = PATHS[variant];
        var search = window.location.search || '';
        if (search) {
            search = search
                .replace(/([?&])force=[^&]*/g, '$1')
                .replace(/([?&])nosplit=[^&]*/g, '$1')
                .replace(/[?&]$/, '')
                .replace(/&&+/g, '&')
                .replace(/^\?&/, '?');
            if (search === '?' || search === '') search = '';
        }
        var hash = window.location.hash || '';
        // location.replace so the back button doesn't trap the user.
        window.location.replace(target + search + hash);
        return; // flicker stays until next page loads
    }

    // ============================================================
    // Expose for the analytics layer + lift the curtain
    // ============================================================
    window.BASEAIM_AB = {
        testName: TEST_NAME,
        variant: variant,
        site: THIS_SITE,
        source: assignmentSource,
        reset: function () {
            try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
            try { localStorage.removeItem(STORAGE_KEY + '_time'); } catch (e) {}
            document.cookie = COOKIE_NAME + '=; path=/; max-age=0';
            location.reload();
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', liftFlicker);
    } else {
        liftFlicker();
    }
})();
