# GitaGuide
Private early-access app. Vanilla accessible frontend and dependency-free Cloudflare Worker.

## Build and checks
`npm run build` then `npm test`. Build produces dist/server/index.js and dist/.openai/hosting.json.

## Modes
Default: BM25 keyword retrieval plus editorial topic mappings and prepared, labeled reflections. Full 701-record Sanskrit/English source browser, exact verse lookup, in-memory conversations, saved verses, feedback and reset.
Optional: configure OPENAI_API_KEY as a server-side Sites secret; OPENAI_MODEL defaults to gpt-4o-mini. This enables constrained model explanations. No credentials belong in browser code. Citation IDs are validated; source text is inserted exactly. Automated ID validation does not prove interpretive correctness.

## Remaining before production
Translation-specific licensing review (see SOURCE.md); Sanskrit and interpretation review; embeddings and semantic retrieval; broader human grounding/safety evaluation; persistent abuse throttling before widening access; performance and browser QA. AI API not live-tested without credentials. Prepared reflections are editorial and not personalized AI. Feedback is session-only and is not transmitted for analysis. No application database or analytics trackers. Server/AI providers may retain operational data under their policies. Google Fonts is used.
