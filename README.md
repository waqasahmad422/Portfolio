# Waqas Ahmad Shah — Portfolio

A fast, accessible, dependency-free portfolio site: plain HTML, CSS and JavaScript. No build step, no CDNs.
Live: https://waqasahmadshah.vercel.app/

## Structure

```
index.html        all content (sections: home, about, services, portfolio, contact)
css/style.css     tokens, components, responsive rules, dark mode, accent skins
js/main.js        section navigation, menu, theme/accent, typing effect, filters, contact form
fonts/            self-hosted Plus Jakarta Sans + Clicker Script (latin, woff2)
images/           optimized WebP photos and project screenshots, favicon, social share image
CV.pdf            linked from the "Download CV" button
vercel.json       security and cache headers
```

## Editing content

- **Text, links, skills, timeline:** edit `index.html`. Skill bars use `style="--level: 90%"` plus `aria-valuenow`.
- **Add a project:** copy an `<article class="project">` block, set `data-category="frontend"` or `"fullstack"`,
  and add a 900px-wide WebP screenshot to `images/projects/`.
- **Age:** calculated automatically from `BIRTH` in `js/main.js`.
- **Accent colours / dark mode:** tokens at the top of `css/style.css`. The default accent is set by `--skin`.
- **Icons:** an inline SVG sprite at the top of `<body>`; use `<svg class="icon"><use href="#i-name" /></svg>`.

## Contact form

By default the form opens the visitor's email app with the message filled in (no server needed).
To send messages in the background instead, create a form at Formspree or Web3Forms and put its URL in
`data-endpoint` on `<form id="contact-form">`.

## Run locally

```
python3 -m http.server 8000
```
then open http://localhost:8000. Deploy by pushing to GitHub with Vercel connected.

## Motion

- Panels cross-fade in the direction you move through the menu (`--dir` is set in `js/main.js`).
- Content blocks rise in with a stagger. If you add a new block type, add its selector to both the
  `.section.active :is(...)` rule in `css/style.css` and `STAGGER` in `js/main.js`.
- Theme and accent changes cross-fade through registered colour tokens (`@property` in `css/style.css`).
- Also included: scroll progress bar, skill count-up, project grid replay on filter, hover lifts, hero pointer parallax.
- Everything respects `prefers-reduced-motion` (animations are effectively disabled) and only animates
  `transform` and `opacity` (plus colour tokens), so it stays smooth on phones.

## Accessibility and performance notes

Keyboard navigable with visible focus, skip link, reduced-motion support, `prefers-color-scheme` aware,
0 axe-core violations (WCAG 2.1 AA) in light and dark themes. Accent colours are tuned so white button text passes 4.5:1.
