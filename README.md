# Cali Performance Detailing — Website Bundle

Premium, racing-inspired responsive website bundle built with plain HTML, CSS and JavaScript. No build step or package install is required.

## Files
- `index.html` — page structure and editable page copy
- `style.css` — responsive styling, layout, motion and accessibility states
- `script.js` — mobile navigation, gallery filters, accessible photo viewer and SMS enquiry form
- `assets/media/` — optimized WebP vehicle and detailing photographs plus favicon
- `assets/reviews/` — original customer-review screenshots retained as reference; the site uses clean HTML testimonial cards, not screenshots
- `assets/reference/` — original Google business/service screenshots for future content edits; not displayed on the site

## Preview locally
Open `index.html` in a modern browser. For the best local experience, run a simple static server from this folder, for example `python -m http.server 8000`, then open `http://localhost:8000`.

## Contact details used
- Phone: +1 408-829-5249
- Address shown in the supplied profile screenshot: 113 Commerce Cir, Sacramento, CA 95815, United States
- Main actions: direct phone call, text request, and Google Maps directions

The enquiry form does not send data to a server or store it. It builds a message and opens the visitor's SMS app. The live website fonts are loaded from Google Fonts, with system fallbacks included.

## Before publishing
Confirm the phone number/address and final service list with the business owner. Review wording is limited to short excerpts from supplied screenshots. The website does not invent prices, opening hours, guarantees, or a total review count.


## Stable version notes
This version intentionally does not use scroll-reveal animations or any JavaScript-controlled visibility. All sections are visible by default; motion is limited to optional hover transitions and image interactions. This avoids blank sections if a script or IntersectionObserver fails.

## Deploying to GitHub Pages
1. Extract this ZIP.
2. Upload the CONTENTS of `cali-performance-detailing-stable` to the root of the repository that publishes the site. `index.html`, `style.css`, `script.js`, and `assets/` must sit together at the published root. Do not upload only the outer folder as a nested folder unless your Pages settings publish that exact folder.
3. Commit the files, wait for the Pages deployment to finish, then open the live URL in a private/incognito tab or hard-refresh.
4. If the old version still appears, check that Pages is publishing the branch/folder you updated and that the URL points to that repository.
