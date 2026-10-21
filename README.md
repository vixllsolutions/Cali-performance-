# Cali Performance Detailing — Mobile-First Redesign

This is a **four-file replacement bundle**. It intentionally does not include an `assets` folder. Keep the existing `assets/media` folder from your current deployment.

## Replace these files

- `index.html`
- `style.css`
- `script.js`
- `README.md` (optional; for your reference)

Place the three website files at the same published root as the existing `assets` folder. Keep the image filenames unchanged.

## Asset paths used

The page uses images already included in the previous bundle, including:

- `assets/media/red-corvette-detail-prep.webp`
- `assets/media/red-corvette-rear.webp`
- `assets/media/blue-car-foam-wash.webp`
- `assets/media/front-end-detail.webp`
- `assets/media/engine-bay-detail.webp`
- `assets/media/red-car-finish-detail.webp`
- `assets/media/white-car-wheel-detail.webp`
- `assets/media/off-road-vehicle-cleanup.webp`
- `assets/media/black-performance-sedan.webp`
- `assets/media/black-sports-car-engine-check.webp`
- `assets/media/favicon.svg`

## Design and behavior

- Responsive layouts for desktop, tablet and mobile, without fixed-width page panels.
- Mobile dropdown navigation, service inquiry links, gallery filters and a photo viewer.
- Progressive scroll reveals with a visible-by-default fallback and reduced-motion support.
- A contact form that prepares an SMS draft rather than storing or sending form data to a server.

## Deploy

Upload/commit `index.html`, `style.css` and `script.js` together. Keep the existing `assets` folder alongside them. After the deployment finishes, open the live page in an incognito/private tab to reduce stale cache effects.
