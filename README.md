# Baseaim - Client Acquisition Landing Page

A high-converting landing page designed for Australian accounting firms to book qualified strategy calls through Facebook Ads.

## Features

- **Hero Section** with clear value proposition and dual CTAs
- **VSL Integration** for video-first messaging
- **Fast Path** for high-intent visitors
- **Trust Building** with testimonials and story
- **How It Works** clear 3-step process
- **Risk Reversal** with performance guarantee
- **FAQ Accordion** for objection handling
- **Cal.com Booking** integration
- **Sticky Mobile CTA** for maximum conversions
- **Fully Responsive** design for all devices

## Setup Instructions

### 1. Replace Video Embeds

Update the video embed URLs in `index.html`:

**Hero Video (Line 39):**
```html
<iframe src="https://www.youtube.com/embed/YOUR_VIDEO_ID"...
```

**VSL Video (Line 80):**
```html
<iframe src="https://www.youtube.com/embed/YOUR_VSL_VIDEO_ID"...
```

### 2. Replace Cal.com Booking Link

Update the Cal.com embed in `index.html` (Line 226):

```html
<iframe src="https://cal.com/YOUR_USERNAME/YOUR_EVENT"...
```

To get your Cal.com embed code:
1. Log into Cal.com
2. Go to your event type settings
3. Click "Embed"
4. Copy the iframe code
5. Replace the placeholder in the HTML

### 3. Add Real Testimonials

Replace the placeholder testimonials in the Trust & Story section (Lines 106-120) with real client testimonials.

### 4. Customize Colors (Optional)

Edit the CSS variables in `styles.css` (Lines 10-17) to match your brand:

```css
--primary-color: #2563eb;
--primary-hover: #1d4ed8;
```

## File Structure

```
baseaim-landing-page/
├── index.html          # Main HTML structure
├── styles.css          # All styling and responsive design
├── script.js           # Interactivity and smooth scrolling
└── README.md           # This file
```

## Key Conversion Elements

### Multiple Conversion Paths
1. **Hero CTA** → Direct to booking
2. **Watch Video** → VSL → Booking
3. **Fast Path** → Skip to booking
4. **Sticky Mobile CTA** → Always accessible on mobile

### UX Best Practices Implemented
- No external links to prevent drop-off
- Smooth scrolling between sections
- FAQ accordion to handle objections inline
- Sticky CTA appears on mobile after 300px scroll
- All sections end with a CTA
- 1-2 scroll maximum to reach booking section

### Mobile Optimization
- Responsive grid layouts
- Touch-friendly buttons
- Sticky bottom CTA bar
- Optimized typography for small screens
- Video embeds scale properly

## Testing Checklist

Before going live, test:

- [ ] Video embeds play correctly
- [ ] Cal.com booking calendar loads
- [ ] All CTAs scroll to correct sections
- [ ] FAQ accordion opens/closes
- [ ] Sticky mobile CTA appears when scrolling
- [ ] Page looks good on mobile, tablet, and desktop
- [ ] Form submission works in Cal.com embed
- [ ] Page loads quickly (under 3 seconds)

## Analytics Setup (Recommended)

Add Google Analytics or Facebook Pixel to track:
- Page views
- Scroll depth (already implemented in script.js)
- CTA clicks
- Video plays
- Booking form submissions

Add your tracking code before the closing `</head>` tag in `index.html`.

## Deployment Options

### Option 1: Static Hosting (Recommended)
- **Netlify** (free): Drag and drop folder
- **Vercel** (free): Connect GitHub repo
- **GitHub Pages** (free): Push to repo

### Option 2: Traditional Hosting
- Upload all files to your web server via FTP
- Ensure files are in the root directory or subdirectory

### Option 3: WordPress
- Use "Simple Custom CSS and JS" plugin
- Or use a custom HTML block in Elementor/Gutenberg

## Performance Tips

1. **Optimize Videos**: Use YouTube or Vimeo for hosting (already implemented)
2. **Compress Images**: If you add images later, use TinyPNG
3. **Enable Caching**: Configure on your hosting platform
4. **Use CDN**: Cloudflare (free tier works great)

## Browser Support

Tested and working on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Customization Guide

### Change Button Text
Edit the text inside `<button>` tags in `index.html`

### Modify Sections
Each section is clearly labeled with HTML comments:
```html
<!-- SECTION 1: HERO -->
```

### Adjust Spacing
Modify the `--section-padding` variable in `styles.css`:
```css
--section-padding: 80px 0;
```

## Support & Questions

This landing page follows conversion best practices for:
- Facebook Ad traffic
- High-intent B2B audiences
- Video Sales Letter (VSL) funnels
- Cal.com booking funnels

## License

Proprietary - Built for Baseaim
