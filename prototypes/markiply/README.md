# Markiply MVP v1.5 (scripted prototype)

Open `index.html` in a browser. No server or install needed. Login: maya@talentscout.example (the link on the login page fills it).
Presenter strip: hover the top edge or press **T**. It has PRD tags, Team view, Design system and Reset demo.
Everything is scripted. Providers, tools, ratings, quotes and all numbers are fictional samples.
Saved state uses a new storage key, so v1.5 starts fresh and never mixes with earlier versions.

## What changed in v1.5 (Decide and Act)
1. **Progress bar follows what the user does.** Act becomes current when the user presses the next-step button (See providers, See tools, See both, or Turn into an action plan). Results pages, provider and tool pages, the Connect dialog and the action plan all count as Act, and Decide gets its check at that moment. Act stays current, with no "done" state. Clicking Decide goes back.
2. **"Then, in order" steps are always visible** on Decide, no longer collapsed.
3. **"Turn into an action plan" is the main button** when the first step has no providers or tools (budget case). In the blueprint case it sits beside "See providers".
4. **Your approach (budget and blueprint only).** Three options with the recommended one preselected. Pick another, or pick two to combine them. At least one stays selected. The choice appears in the Decision summary as "Your approach" and drives the plan. Video has no approach choice, because its provider, tool or both card is already the split.
5. **A fuller action plan page.** Overview (decision, why, what we understood, what would change this), your approach, the numbers table (budget), the steps, checkpoint, template. Each step shows "Under your approach" lines (both options when combined). A contents bar jumps between sections.
6. **Notes on steps.** "Add note" on each step. Notes land in the Decision summary under "Added by you" with the step name, and in the report.
7. **One report for everything.** PDF in the Decision summary, on Decide and on the plan page opens a report preview of the decision as it stands (draft or final, plus the plan once it exists) with "Download as PDF" (the browser print dialog). Share is still a design-only demonstration.
8. **"Why this fits your ask" is open on Decide** and "Options considered" is replaced by the approach choice in plan cases.

Checked: 0 console errors, 0 AA contrast failures on the audited pages, no horizontal scroll at 390px and 1440px, approach, plan, notes, report and progress bar tested in the budget, blueprint and video cases.

## Flags for Hadar (new in v1.5)
- The plan is generated from scripted wording per approach. In the product, our own content or a model would write it, so the plan page needs a content source and review.
- The numbers table shows the recommended split only. A different approach should recalculate it in the product.
- Notes on steps are saved as notes with the step name. The product should attach them to the step.
- The report is a print view in this prototype. The product needs a real document export.

## Carried from v1.4
### What changed in v1.4 (two fixes)
1. **Answers no longer disappear.** Clicking an option only selects it, and it stays on screen and highlighted. **Continue now appears on every question**, pick-one and pick-several alike, so all questions behave the same. Typing in the box while an option is selected keeps the option as the answer and saves the text as a note under "Added by you" in the Decision summary (for example, a 1.2M budget "spread over time"). The v1.3 pop animation, delay and sliding question card are removed. The Decision summary animations stay and fire when you press Continue.
2. **"Your next step" card redesigned** (Decide page). Same function: selectable cards for provider, tool and Markiply expert, with the adaptive button. New look: a designed card with the logo-color top line, no icons and no tick boxes, a filled selected state with a check mark, color by meaning (pink providers, sky blue tools, purple expert), plain count facts, and no "Early matches" line. "Why this fits your ask" is now open by default, and "Ask about this recommendation" stays collapsed.

Checked: 0 console errors, 0 AA contrast failures, no horizontal scroll at 390px and 1440px, every option on every question of the three demo cases selected, highlighted and kept (desktop and phone).

## Flags for Hadar (new in v1.4)
- A note typed with a chosen option is stored as a general note, not tied to that question. In the product it should attach to the answer.
- Please confirm that every question should show at least 3 options.

## Carried from v1.3
### What changed in v1.3 (look and feel round)
1. **Providers and tools page is colorful and has hierarchy.** Lilac page ground, a gradient ribbon and logo-color line on the Best Fit card, a tinted facts column on every card, gradient button on Best Fit only, solid brand buttons on the others, outlined "View details". Providers lean pink and purple, tools lean sky blue.
2. **Invented small logos** for all 27 providers and 21 tools (fictional marks, none imitating a real brand). They also appear in the Decision summary, the Connect dialog and detail pages.
3. **One card format.** The reasons are always visible, "See why" is gone, and the first card keeps its frame as the top pick.
4. **"Matches X of 6 answers" is now explained.** Hover, focus or tap the info icon to see every answer with a check or "Not confirmed". Matched tags stay on the card.
5. **Micro-animations** (all under 250ms, reduced-motion respected): answer chip pop and card slide, the answer landing in the summary (row flash, badge bump, count tick, progress fill), recommendation skeleton on first arrival, card stagger, hover lift with a Best Fit sheen, Connect "Sending" and a drawn check, Select feedback, smooth summary panel slide, popover fade.
6. **Livelier system.** Lilac grounds, spectrum accents at key moments (the home headline, the Decide heading, the top line), and color for meaning: pink for action, purple for expert, sky blue for tools, green for evidence. Option cards on Decide have icon tiles.

Checked: 0 console errors, 0 AA contrast failures, no horizontal scroll at 390px and 1440px, nothing under 13px except 12px metadata on My decisions, no looping animations under reduced motion.

## Flags for Hadar (new in v1.3)
- **Match detail is a text comparison** of the answers against provider and tool records. The product needs structured fields to do this for real.
- **"Not confirmed"** means Markiply holds no record yet, not that it does not fit. Please confirm the wording. In the prototype the written reasons are scripted, so a reason can sound stronger than the popover (for example budget).
- **Logos and the solid button are invented placeholders.**

## Carried from v1.2
### What changed in v1.2 (refinement round)
1. **Clarify split is 7:5.** Two thirds for the questions, one third for the Decision summary.
2. **Decision summary starts collapsed** on Decide, Act, results and detail pages. It is open only on Clarify. The header toggle opens it, and a manual open or close is remembered separately for Clarify, for Decide and Act, and for the results.
3. **Early recommendation is a slim floating bar** (48px, one row, outline button, no gradient): "See early recommendation" with "12 providers, 8 tools" inside. It sits under the question column with a gap from the bottom edge and disappears once every question is answered. On phones the counts sit on a second line inside the same bar.
4. **New header: title, stepper, Decision summary in one sticky row (64px).** Title on the left (up to two lines), stepper centered on the page, summary toggle on the right. Click the title for a small popover with the decision name, **Your ask** (the first request, in full) and **Rename**. Under 1000px it becomes two rows (title and summary, then the stepper). The decision title is the saved name on My decisions, and "New decision…" is gone.
5. **Provider and tool cards redesigned.** Identity and trust tags, then **Why it fits you** (one personalized line, "Matches 3 of your 6 answers", and match tags taken from your answers), then three key facts, then actions. The Best Fit card opens with the full reasons and a solid button. The others show two lines, a soft button and "See why". **Connect via Markiply** and **Select this tool** now work straight from the card.
6. **Type and color pass.** One scale for the whole app, tokens only: display 40, page title 28 (24 on phones), lead 17, section 22, card title 17, body 16, secondary 15, small 14, label 13. Font sizes went from 15 different values to 11 (two of them are logo-tile letters). Inter uses only 400, 600 and 700. The four h1 sizes (24, 26, 28, 30) are now one. See DESIGN-SYSTEM.md.
7. **Palette from v6 and the logo.** Lilac-tinted neutrals from v6 (lines `#EFE1F3`, wash `#FAF2FA`), a softer card shadow, and the logo colors in the 3px line above the top bar. The brand pink, purple, gradient and status colors were already the v6 ones. v6 pill buttons, large radii and Arimo were not adopted (corners stay 6px, one type pair).
8. **Fixed on the way:** the Team page overflowed sideways on phones and lost its side padding.

Checked: 0 console errors, 0 AA contrast failures on 11 pages and states, nothing under 13px except 12px metadata on My decisions, no horizontal scroll at 390px, page heights moved by 6px at most on desktop (one phone page by 33px).

## Flags for Hadar (new in v1.2)
- **Decision title is scripted** here. In the product it would be inferred from the first ask, so the **Rename** in the popover matters. Suggested limit: 60 characters.
- **"Why it fits you"** must come only from the person's answers and Markiply records, never invented praise. The match tags in the prototype are computed from the answers.
- **Solid brand button on the Best Fit card.** The gradient stays reserved for one primary action per screen, so cards use a solid fill. Please confirm.
- **Logo-color line** above the top bar replaces the plain pink line. Easy to revert.

## Carried from v1.1
### What changed in v1.1 (from the 24 feedback items)
1. **Look**: white ground, soft pink tints, gradient only on the one primary action, thin pink strip above the top bar. Corners are 6px (cards, buttons, inputs), 4px (tags), 8px (dialogs), none on the panel. *Radius was not specified, so this is my default. Please confirm.*
2. **Top bar**: full width. Logo and a tinted Partner button on the left. My decisions and an icon-only avatar on the right. It hides when you scroll down and returns on scroll up, on top-edge hover and on keyboard focus.
3. **Stepper**: (superseded in v1.2 by the one-row header).
4. **Decision summary panel** (document-checklist icon) replaces "What I know". Own scroll, no rounded corners, plain-word progress. Sections: your answers (pencil on hover only), added by you, brief, how I got here, contacted providers (date and "View what I sent"), selected tools, download and share. (Superseded in v1.2: open only on Clarify, 7:5 split.)
5. **Clarify**: the question is the title. Card and panel tops align, 16px apart. Back and Next. The send arrow acts as Continue. The finished page has a box to add something or ask. Notes appear under "Added by you". Returning to Clarify always lands on the finished page.
6. **Decide**: no Draft, Final or Saved chips. Recommendation, then "Your next step" with three option cards (Find a provider, Find a tool, Work with Markiply). The main button adapts ("See providers", "See tools", "See providers and tools", "Talk to a Markiply expert"). Why it fits and the rest sit under "Go deeper". PDF, Share and Save and lock stay on the right. No bottom bar.
7. **Act**: each step is an instruction with plain buttons. A single-step decision skips the plan page.
8. **Results**: Back and Forward, no generated title, one explanation line, tabs when both providers and tools are chosen, up to 12 providers and 8 tools, identical cards ("View and connect" / "View and select"). Detail pages: Connect via Markiply, or Select this tool with Visit website as secondary. The tool page uses the v6 content (our take, best for, not ideal for, integrations, alternatives). No bottom bars anywhere after Clarify.
9. **Expert access** is down to three places: the Markiply option card, the summary link, and "Ask about this step".
10. **My decisions**: smaller type (12px metadata), a second project with three decisions, plain-text status, and menus that open as popups so nothing is clipped.
11. **Partner perk idea**: a tool can carry a "Partner offer" block, labeled as separate from ranking. Sample only.

### Flags for Hadar (v1.1)
- **Choice moved from per-action to decision level** (PRD US 4.3 describes it per action). Multi-step plans still keep per-step buttons on Act.
- **Notes do not regenerate the recommendation.** They are stored in the summary only.
- **"Update blueprint"** still conflicts with the PRD's no-regeneration rule (see open questions).
- **"Save and lock" vs "Finalize decision"**: naming to confirm.
- **Status chips**: Gil asked to remove them everywhere. Plain-text status remains in the My decisions list. Confirm that is acceptable.
- **Label mapping** (below) still needs confirming.
- Whether to save the design system to the MARKIPLY project docs, and as a future skill.

## What changed from iteration 4
1. **One persistent "What I know" panel** on Clarify, Decide, Act and results. Collapsible, open by default, fills as you answer. Rows are editable (or locked). Shows where you are (Clarify, Decide, Act) and, for the blueprint, which sections are done and which required ones are missing. "More context" and "Why Markiply recommends this" sit collapsed at the bottom.
2. **Two paths per step**: Find a provider and Find a tool. One button if only one applies, a short note if none. Tools carry trust labels, plus a "Not curated yet" case.
3. **Matches so far bar** from the first question. Counts providers and tools, always opens Decide. Decide is a Draft with a "not fully clarified" notice until the last question is answered and viewed, then Final. Connecting from the early list is allowed.
4. **Home** is the ask box, three examples and More examples. **My decisions** is in the top bar.
5. **Projects and pinning** in My decisions: pinned first, then projects, then standalone decisions. New, rename, pin, delete (confirms, ungroups). Move a decision into a project from its menu.
6. **Save and lock** on Decide (next to PDF and Share). States: Draft, Final, Locked. Unlock with a warning. Later edits are marked "edited after recommendation".
7. **Demo cases**: video agency, marketing blueprint (task "Target accounts and ICP" inside project "Marketing blueprint 2027"), $1.2M budget split. Reach, diagnosis, SEO vs paid, fast video and the generic fallback are under More examples.
8. **One question at a time** with a why line, back arrow, clickable panel answers, free text on every step. Changing an earlier answer keeps later answers and re-asks only what is new. One conditional question exists in the blueprint ("Who would keep the list up to date?") and one in the budget case ("Which emerging markets").
9. **New design system** (see DESIGN-SYSTEM.md and design-system.html): Manrope and Inter bundled, nothing under 13px, AA contrast, v6 look.
10. **Unified Decide page**: recommendation, why it fits your ask, next steps. Everything else is under "Go deeper". "Turn into action plan" builds the plan (the blueprint for the blueprint case) in Act.
11. **Top bar**: "Partner with Markiply" opens https://www.markiply.com/en in a new tab. **Talk to a Markiply expert about this decision** opens a modal with a read-only "Shared with your request" summary, an optional note and a simulated send. On a step it reads "Ask about this step".
12. **Budget case** takes only what helps decide from v6: one-line recommendation with numbers, before/after split with bar and reserve, three findings tagged "Your data", options A/B/C, one "what would change this" line, a 3-week plan and Day 90 check in Act, sample template download, visible assumptions.

## Beyond the PRD (for Hadar)
Early draft results, the tools path, projects and pinning, save and lock, the blueprint as a deliverable, in-app expert requests, one persistent panel, "why we ask" lines. All are tagged "Proposed, beyond PRD" in the tag overlay.

## Open questions
- **Regenerating the blueprint.** The PRD says no regeneration. The prototype keeps that for every case, and for the blueprint offers an explicit **Update blueprint** button after edits, which creates a new version. Needs Hadar's confirmation.
- **Trust label mapping.** The PRD has four labels. This build shows v6 wording and maps behind the scenes:
  | Shown | PRD label |
  |---|---|
  | Markiply Verified | Markiply Verified |
  | Referred by our network | Expert Recommended |
  | Recommended by peers | Community Recommended |
  | Listed, not yet verified | Not Verified |
  | Researched by Markiply (tools) | Markiply Verified, for tools (proposal) |
  | Not curated yet (tools) | Not Verified |
- Button name for locking: "Save and lock" or "Finalize decision".
- Parked: bell or alert marker, replies from experts, consolidating tasks into one blueprint.

## Files
home, clarify, decide, act (plan), results (providers and tools), decisions, login, team (illustrated exports), design-system. `data.js` holds all content, `app.js` the engine, `mk.css` the design system, `assets/` logo and fonts.
