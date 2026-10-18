# Gil Nakar Portfolio Website v26

Static GitHub Pages portfolio package. Upload the folder contents to GitHub Pages.

## v26 updates
- New case study: Markiply (cases/markiply/), placed first in the sidebar and homepage grid, before Imubit. Three screens with captions, role, challenge, approach, value, "Behind the work", and "What's next".
- Working prototype bundled at prototypes/markiply/ (open prototypes/markiply/index.html). The "Open prototype" button opens it in a new tab. Demo sign-in: maya@talentscout.example.
- Lightbox fixes (all pages): images now fit the screen correctly (the old zoom math shrank them a second time, which made them tiny on phones). Added pinch-to-zoom, one-finger pan, swipe between images, double-tap zoom, page scroll lock while open, 44px controls, and clearer captions (title and description on separate lines).
- Mobile polish: "Tap to zoom" hint on content images, 44px minimum tap targets for navigation and filters, 12px minimum text.
- COS Dashboard case study is now a normal, open case study (password screen and script removed, old backup copies of the page removed). Its sidebar link is styled like the others on every page, and the homepage sidebar now lists it.
- Madafino and Audioburst case studies are unchanged in this version; they are replaced in the next phase.

## Earlier versions
- v21: copy cleanup; Madafino interactive concept prototype shown before the mobile wireframe.

## v27 – sharper zoom (lightbox)
- Zoom now resizes the image itself instead of `transform: scale()` + `will-change`, so the browser repaints real pixels at every zoom level (no more stretched, blurry bitmap).
- Maximum zoom follows each image's real resolution (about 2x device-pixel density), so it never magnifies into a smear.
- New case studies can set `data-zoom-src="full-res.jpg"` on an image: the page shows a light version, the viewer loads the full file.
- `?v=27` added to the CSS/JS links so browsers pick up the new files.
- Limit: images that are small at the source (e.g. Matrix mobile screens ~563px, Architecture slides ~420-670px) cannot be sharper than their files. Send originals/exports to improve those.

## v27 – new Audioburst and Madafino case studies (UX process)
- `cases/audioburst/index.html` and `cases/madafino/index.html` were rebuilt from Gil's PDFs, sketches, flows and wireframes: needs and challenge, users and personas, user story, critical route, sketches, user flows, information architecture, the wireframes as the centerpiece, alternatives left out, and results.
- Madafino keeps both original Figma embeds, now with an "Open in Figma" link beside each.
- New images live in `assets/audioburst-ux/` and `assets/madafino/`. Each large image has a light page version and a `-full.jpg` file that the zoom viewer loads (`data-zoom-src`).
- Flow diagrams are cut into readable crops and also written out as text ("Read the steps as text").
- Homepage card descriptions for both projects were updated.
- Dead files (110 images in `assets/` that no page references, including the old Audioburst board images) are not in this package. They remain in the v26 package if a rollback is ever needed.
