# Agent Memory PPT Deck

This repository contains an editable PowerPoint deck for an internal sharing session on agent memory.

The current deck covers:

- a short history of agent memory
- recent core projects from late 2024 to 2026-04-09
- benchmark and dataset overview
- deeper analysis of `MemOS`, `Supermemory`, and `MemPalace`
- side-by-side comparison and scenario-based recommendations

## Main Files

- `agent-memory-opening-deck/build-deck.cjs`
  The source of truth for the deck. Edit this file to change slides.
- `agent-memory-opening-deck/agent-memory-opening.pptx`
  The generated editable PowerPoint output.
- `agent-memory-opening-deck/package.json`
  Minimal Node.js dependency setup.
- `agent-memory-opening-deck/pptxgenjs_helpers/`
  Local helper utilities copied from the Codex slides skill. Keep these in repo so the deck can be rebuilt elsewhere.

## How To Rebuild

From the repository root:

```bash
cd agent-memory-opening-deck
npm install
npm run build
```

This regenerates:

- `agent-memory-opening.pptx`

## Optional Preview Rendering

Preview rendering is optional. It was used for manual slide QA during development.

On macOS, one working path was:

```bash
cd agent-memory-opening-deck
DYLD_LIBRARY_PATH=/opt/homebrew/lib soffice --headless --convert-to pdf --outdir rendered_pdf agent-memory-opening.pptx
pdftoppm -png rendered_pdf/agent-memory-opening.pdf rendered/slide
```

Notes:

- `LibreOffice` (`soffice`) is needed for PPTX -> PDF conversion.
- `pdftoppm` is needed for PDF -> PNG conversion.
- These preview artifacts are intentionally ignored by `.gitignore`.

## Current Slide Structure

At the time of writing, the deck has 20 slides:

1. opening thesis
2. five-stage history timeline
3. late-2024 to 2026 core projects
4. category map
5. anchor projects
6. current-wave shifts
7. opening cheat sheet
8. why benchmarks matter
9. key datasets
10. benchmark map
11. leaderboard interpretation
12. MemOS overview
13. MemOS details
14. Supermemory overview
15. Supermemory details
16. MemPalace overview
17. MemPalace details
18. side-by-side comparison
19. scenario-based selection
20. closing summary

## Editing Guidance For The Next Agent

- Prefer editing `build-deck.cjs`, then regenerate the `.pptx`.
- Do not manually edit the `.pptx` if the change should remain reproducible.
- Keep the deck speaker-friendly: short phrases, strong visual hierarchy, no dense paragraphs.
- Be careful with claims about rankings or “best” systems.
  Use explicit wording like:
  - `public leaderboard`
  - `paper-reported`
  - `vendor-claimed`
- For highly current facts, re-check sources before modifying benchmark or ranking slides.
- The deck currently uses `PingFang SC`; on non-macOS systems this may be substituted.

## Known Caveats

- The layout helper warnings in build output are conservative and include some false positives.
  Manual preview inspection was used for the important slides.
- Preview rendering scripts from the original slides skill were not committed; only the local helper library was committed.
- The deck is good for continued editing and regeneration in a fresh environment, but preview rendering still depends on local system tools.

## Good Next Steps

Useful follow-up improvements:

- add speaker notes / talk track per slide
- tighten benchmark map slide if a more diagrammatic version is desired
- polish wording for a more product-heavy or more research-heavy audience
- add a final sources appendix slide if external citation visibility is important
