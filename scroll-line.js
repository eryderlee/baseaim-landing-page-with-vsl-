/**
 * SCROLL LINE EFFECT
 * ------------------
 * SCROLL_LINE_ENABLED  — toggle the travelling line on/off
 * CIRCLES_ENABLED      — toggle the heading circles on/off
 *
 * Line threads through each section's own background layer (z-index:0 inside section).
 * Circles sit in an absolute overlay on body (z-index:9999), always on top.
 */

const SCROLL_LINE_ENABLED = false;  // set true to re-enable the line
const CIRCLES_ENABLED     = false;  // set false to disable circles

// Selectors for headings that get a circle drawn around them.
// Each entry can be a selector string, or { sel, topOffset } to nudge the
// circle top edge down by N pixels (positive = lower top arc).
const CIRCLE_TARGETS = [
  { sel: '.listen-up-highlight', topOffset: 28, ry: 10 }, // "Listen up" — centre pushed down, tight vertical radius
  '.headline-highlight',        // hero: "We will get you 3+ clients..."
  '.section-eyebrow',           // "What We Found Out"
  '#how-it-works h2',          // "How it works"
  '.guarantee h2',             // "What You're Gonna Get"
  '.guarantee-content h3',     // "Guaranteed results."
  '.testimonials h3',          // "Testimonials from accounting firms"
  '#cta h2',                   // "Book a Strategy Call"
];

const LINE_X       = 22;
const LINE_WIDTH   = 2;
const CIRCLE_WIDTH = 2.5;

// Gradient stops — same blue gradient used on .headline-highlight
const GRADIENT_STOPS = [
  { offset: '0%',   color: '#50a8ff' },
  { offset: '60%',  color: '#0065ff' },
  { offset: '100%', color: '#0040c1' },
];

if (SCROLL_LINE_ENABLED || CIRCLES_ENABLED) {
  document.addEventListener('DOMContentLoaded', initScrollLine);
}

function initScrollLine() {
  if (window.innerWidth > 768) return;

  // ── Per-section spine SVGs (inside each section, z-index:0) ───────────────
  const sections    = Array.from(document.querySelectorAll('body > section, body > footer'));
  const sectionData = [];

  if (SCROLL_LINE_ENABLED) {
    sections.forEach(sec => {
      sec.style.position = 'relative';

      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;overflow:visible';
      addGradientDefs(svg, 'sl-grad-line', 'vertical');
      sec.insertBefore(svg, sec.firstChild);

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', 'url(#sl-grad-line)');
      path.setAttribute('stroke-width', LINE_WIDTH);
      path.setAttribute('stroke-linecap', 'round');
      path.classList.add('sl-spine-seg');
      svg.appendChild(path);

      sectionData.push({ sec, svg, path });
    });
  }

  // ── Circle overlay SVG (absolute on body, z-index:9999) ───────────────────
  const circleSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  circleSvg.setAttribute('id', 'scroll-line-circles');
  circleSvg.style.cssText = [
    'position:absolute',
    'top:0',
    'left:0',
    'width:100%',
    'pointer-events:none',
    'z-index:9999',
    'overflow:visible',
  ].join(';');
  circleSvg.setAttribute('height', document.documentElement.scrollHeight);
  // Gradient for circles — horizontal so it follows the ellipse sweep
  addGradientDefs(circleSvg, 'sl-grad-circle', 'horizontal');
  if (CIRCLES_ENABLED) document.body.appendChild(circleSvg);

  // ── Target headings ────────────────────────────────────────────────────────
  const targets = CIRCLES_ENABLED
    ? CIRCLE_TARGETS
        .map(entry => {
          const sel       = typeof entry === 'string' ? entry : entry.sel;
          const topOffset = typeof entry === 'string' ? 0     : (entry.topOffset || 0);
          const ry        = typeof entry === 'string' ? undefined : entry.ry;
          const el        = document.querySelector(sel);
          return el ? { el, topOffset, ry, circle: buildCircle(circleSvg), triggered: false } : null;
        })
        .filter(Boolean)
    : [];

  // ── Layout: measure everything after full page load ────────────────────────
  function layout() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Update circle SVG height
    circleSvg.setAttribute('height', document.documentElement.scrollHeight);

    // Spine segments
    sectionData.forEach(({ sec, path }) => {
      const secHeight = sec.offsetHeight;
      path.setAttribute('d', `M ${LINE_X} 0 L ${LINE_X} ${secHeight}`);
      const len = path.getTotalLength();
      path.style.strokeDasharray  = len;
      path.style.strokeDashoffset = len;
      path._secTop    = sec.getBoundingClientRect().top + scrollTop;
      path._secHeight = secHeight;
    });

    // Circles — for inline elements (spans) use the parent block for vertical
    // centre and the element's own rect for horizontal
    targets.forEach(t => {
      const el   = t.el;
      const rect = el.getBoundingClientRect();

      // If it's an inline element its rect may span weirdly — use offsetParent walk
      // to get a stable page-Y by summing offsets
      let pageY = 0;
      let node  = el;
      while (node) {
        pageY += node.offsetTop || 0;
        node   = node.offsetParent;
      }
      pageY += el.offsetHeight / 2;

      // For X, use rect (viewport) + scrollLeft (usually 0 on mobile)
      const pageX = rect.left + rect.width / 2;

      // Size the ellipse to wrap the element
      const rx = Math.min(rect.width / 2 + 20, 145);
      const ry = t.ry !== undefined ? t.ry : el.offsetHeight / 2 + 14;

      t._pageY = pageY + (t.topOffset || 0);
      t._pageX = pageX;
      t._rx    = rx;
      t._ry    = ry;

      t.circle.setAttribute('cx', pageX);
      t.circle.setAttribute('cy', t._pageY);
      t.circle.setAttribute('rx', rx);
      t.circle.setAttribute('ry', ry);

      const circ = ellipseCircumference(rx, ry);
      t.circle.style.strokeDasharray  = circ;
      t.circle.style.strokeDashoffset = circ;
      t.triggered = false;
    });
  }

  // ── Scroll handler ─────────────────────────────────────────────────────────
  function onScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Reveal spine per-section
    sectionData.forEach(({ path }) => {
      if (path._secTop === undefined) return;
      const vpBottom = scrollTop + window.innerHeight;
      const revealed = Math.max(0, Math.min(vpBottom - path._secTop, path._secHeight));
      const len = parseFloat(path.style.strokeDasharray);
      path.style.strokeDashoffset = len * (1 - revealed / path._secHeight);
    });

    // Trigger circles
    const trigger = scrollTop + window.innerHeight * 0.78;
    targets.forEach(t => {
      if (t.triggered || !t._pageY) return;
      if (trigger >= t._pageY) {
        t.triggered = true;
        animateCircle(t.circle);
      }
    });
  }

  // Measure after fonts/images are loaded for accurate positions
  window.addEventListener('load', () => { layout(); onScroll(); });
  // Also do a rough layout now so something appears early
  layout();

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => { onScroll(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    const isMobile = window.innerWidth <= 768;
    sectionData.forEach(({ svg }) => svg.style.display = isMobile ? '' : 'none');
    circleSvg.style.display = isMobile ? '' : 'none';
    if (isMobile) { layout(); onScroll(); }
  });

  onScroll();
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function buildCircle(svg) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
  el.setAttribute('fill', 'none');
  el.setAttribute('stroke', 'url(#sl-grad-circle)');
  el.setAttribute('stroke-width', CIRCLE_WIDTH);
  el.setAttribute('stroke-linecap', 'round');
  el.classList.add('sl-circle');
  svg.appendChild(el);
  return el;
}

function addGradientDefs(svg, id, direction) {
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const grad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
  grad.setAttribute('id', id);
  grad.setAttribute('gradientUnits', 'userSpaceOnUse');
  if (direction === 'vertical') {
    grad.setAttribute('x1', '0'); grad.setAttribute('y1', '0%');
    grad.setAttribute('x2', '0'); grad.setAttribute('y2', '100%');
  } else {
    grad.setAttribute('x1', '0%'); grad.setAttribute('y1', '0');
    grad.setAttribute('x2', '100%'); grad.setAttribute('y2', '0');
  }
  GRADIENT_STOPS.forEach(({ offset, color }) => {
    const stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop.setAttribute('offset', offset);
    stop.setAttribute('stop-color', color);
    grad.appendChild(stop);
  });
  defs.appendChild(grad);
  svg.insertBefore(defs, svg.firstChild);
}

function animateCircle(circle) {
  const circ  = parseFloat(circle.style.strokeDasharray);
  const start = performance.now();
  const dur   = 600;
  function step(now) {
    const t     = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    circle.style.strokeDashoffset = circ * (1 - eased);
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function ellipseCircumference(rx, ry) {
  const a = Math.max(rx, ry), b = Math.min(rx, ry);
  const h = Math.pow((a - b) / (a + b), 2);
  return Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));
}
