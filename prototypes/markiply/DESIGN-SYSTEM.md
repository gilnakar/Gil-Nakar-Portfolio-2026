# Markiply design system v1.1

Source of truth: `mk.css` (tokens at the top). Visual language adapted from the v6 prototype; fonts and sizes re-tuned for accessibility. Live reference: `design-system.html`.
Use this file as the brief when asking Claude Design (or anyone) to build the next screens.

## Principles
1. One primary action per screen (magenta gradient). Expert help is the purple outline.
2. Nothing under 13px. Body 16, secondary 15, small 14, labels 13 (caps, sparingly).
3. All text meets WCAG AA. Amber, cyan and coral are fills only, never text.
4. Two font families, four weights. Manrope for headings, Inter for everything else.
5. Magenta only for the primary action and active states. Gradient text only on the home display line.
6. Cards by role: border, radius and shadow mark one object, not every block.

## Fonts (bundled in `assets/fonts`, no network needed)
Manrope variable (headings, weights 700 and 800). Inter variable (body, weights 400 and 600).

## Type scale
| Role | Size | Font | Weight | Line |
|---|---|---|---|---|
| Display | 40 (32 mobile) | Manrope | 800 | 1.12 |
| Page title | 32 (26) | Manrope | 800 | 1.15 |
| Section | 24 (22) | Manrope | 700 | 1.2 |
| Card or step title | 18 | Manrope | 700 | 1.3 |
| Body | 16 | Inter | 400 | 1.55 |
| Secondary | 15 | Inter | 400 | 1.5, soft ink |
| Small | 14 | Inter | 400 | 1.5, soft ink |
| Label | 13 | Inter | 700 caps, +0.06em | |

## Color tokens
ink `#1B1033` (17.9:1), ink-2 `#5B5370` (7.2:1), ink-3 `#6B6384` (5.6:1, the lightest text allowed), bg `#FBF9FD`, surface `#FFFFFF`, tint `#FAF2FA`, line `#EFE1F3`.
Brand `#C2185B`, brand-700 `#9E1449`, brand-100 `#FBE9F0`, purple `#482962`, purple-100 `#EFE6F7`, gradient 135deg `#C2185B` to `#482962`.
Status text on its tint: ok `#0B6B53` on `#E3F6EF`, warn `#8A4B05` on `#FDF1DC`, gap `#9D174D` on `#FDE6EF`, neutral `#4B5563` on `#F1F1F4`.
Fills only: coral `#E63946`, amber `#FFB84D`, cyan `#52C1E6`.

## Space, shape, motion
Space 4, 8, 16, 24, 32, 48. Radii 10 (inputs), 16 (cards), 22 (large), pill (buttons, chips, labels). Soft purple-tinted shadows. Motion under 250ms, reduced-motion respected.

## Components
- **Buttons**: primary (gradient), secondary (outline), expert (purple outline), quiet, small, icon. Path buttons in a step are secondary: "Find a provider", "Find a tool".
- **Trust labels** (`.tb`): Markiply Verified, Recommended by peers, Referred by our network, Researched by Markiply (tools, with sample rating), Listed not yet verified, Not curated yet, Best Fit. v6 wording shown, PRD label kept in `LABELS.prd`.
- **State chips** (`.sc`): Draft, Final, Locked, Acting.
- **Notes** (`.note`): neutral, ok, warn.
- **Question card** (`.qcard`): one question, why line, chips, free-text row, back arrow.
- **What I know panel** (`.panel`): collapsible, rows editable or locked, progress, folds. Bottom sheet below 980px.
- **Matches bar** (`.mbar`), **action bar** (`.actbar`), **step card** (`.stepc`), **provider and tool cards** (`.pcard`, `.prow`), **project card** (`.proj`), **modal** (`.modal`), **toast**.

## Layout
Shell max 1200px with 32px gutters (16 on phone). Decision pages: main column up to 760px plus a 360px panel. Panel and bars become a sheet and stacked bars on phone.


## v1.1 changes
- **Ground**: white page, `--tint` #FFF6FA and `--tint-2` #FDEBF3 for washes, `--line` #F0DFE8. Gradient only on the one primary button per screen.
- **Shape**: 6px on cards, buttons, inputs and chips; 4px on tags; 8px on dialogs; 0 on the Decision summary panel. Shadows are removed except on popups and the primary button.
- **Type**: page title 30, section 22, card title 17. Floor stays 13px. 12px is allowed only for metadata on My decisions.
- **Head**: 3px pink line, full-width 56px top bar that hides on scroll down, and a separate sticky stepper with no background.
- **Components added**: soft button, option card (checkbox style), uniform result card, tabs, nav row (Back, Forward, Next), summary panel rows, tooltip (`data-tip`, also on keyboard focus), perk block.
- **Removed**: Draft, Final and Saved chips, bottom action bars, the dark depth pill, the vertical collapse tab.
