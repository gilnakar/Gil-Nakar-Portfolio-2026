# v26 QA

- All 107 images across the 10 pages load (0 broken) on the full site.
Checked (Chromium, touch emulation at 360, 390 and 768 px wide; desktop 1440 px):
- No horizontal overflow on any page.
- No small tap targets (under 40 px) and no text under 12 px on any page at 360, 390 and 768 px.
- Lightbox on touch: image fits the screen, pinch-zoom, pan, swipe, double-tap, Reset and close controls all working.
- Lightbox on desktop: wheel zoom at cursor, drag pan, arrows, Esc, scroll lock released on close.
- Markiply prototype opens from the subfolder and runs login, flow and recommendation.
- Homepage filters still work with the new card.
- All local links and assets resolve.

Known items not changed:
- Madafino Figma embeds are narrow on phones (about 320 px wide); replaced in the next phase.
