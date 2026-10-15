# Markiply MVP v1.1 (scripted prototype)

Open `index.html` in a browser. No server or install needed. Login: maya@talentscout.example (the link on the login page fills it).
Presenter strip: hover the top edge or press **T**. It has PRD tags, Team view, Design system and Reset demo.
Everything is scripted. Providers, tools, ratings, quotes and all numbers are fictional samples.

## What changed in v1.1 (from your 24 feedback items)
1. **Look**: white ground, soft pink tints, gradient only on the one primary action, thin pink strip above the top bar. Corners are 6px (cards, buttons, inputs), 4px (tags), 8px (dialogs), none on the panel. *Radius was not specified, so this is my default. Please confirm.*
2. **Top bar**: full width. Logo and a tinted Partner button on the left. My decisions and an icon-only avatar on the right. It hides when you scroll down and returns on scroll up, on top-edge hover and on keyboard focus.
3. **Stepper**: its own slim widget, no background, left-aligned and sticky. The Decision summary toggle sits at the right end of the same row.
4. **Decision summary panel** (document-checklist icon) replaces "What I know". Own scroll, no rounded corners, plain-word progress. Sections: your answers (pencil on hover only), added by you, brief, how I got here, contacted providers (date and "View what I sent"), selected tools, download and share. Open by default on Clarify, Decide and Act, closed by default on results and detail pages. Clarify uses a 5:7 chat-to-panel split.
5. **Clarify**: the question is the title. Card and panel tops align, 16px apart. Back and Next. The send arrow acts as Continue. The finished page has a box to add something or ask. Notes appear under "Added by you". Returning to Clarify always lands on the finished page.
6. **Decide**: no Draft, Final or Saved chips. Recommendation, then "Your next step" with three option cards (Find a provider, Find a tool, Work with Markiply). The main button adapts ("See providers", "See tools", "See providers and tools", "Talk to a Markiply expert"). Why it fits and the rest sit under "Go deeper". PDF, Share and Save and lock stay on the right. No bottom bar.
7. **Act**: each step is an instruction with plain buttons. A single-step decision skips the plan page.
8. **Results**: Back and Forward, no generated title, one explanation line, tabs when both providers and tools are chosen, up to 12 providers and 8 tools, identical cards ("View and connect" / "View and select"). Detail pages: Connect via Markiply, or Select this tool with Visit website as secondary. The tool page uses the v6 content (our take, best for, not ideal for, integrations, alternatives). No bottom bars anywhere after Clarify.
9. **Expert access** is down to three places: the Markiply option card, the summary link, and "Ask about this step".
10. **My decisions**: smaller type (12px metadata), a second project with three decisions, plain-text status, and menus that open as popups so nothing is clipped.
11. **Partner perk idea**: a tool can carry a "Partner offer" block, labeled as separate from ranking. Sample only.

## Flags for Hadar (v1.1)
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
