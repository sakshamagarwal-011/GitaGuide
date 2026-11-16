# GitaGuide
Private early-access app. Vanilla accessible frontend and dependency-free Cloudflare Worker.

## Build and checks
`npm run build` then `npm test`. Build produces dist/server/index.js and dist/.openai/hosting.json.

## Modes
Default: BM25 keyword retrieval plus editorial topic mappings and prepared, labeled reflections. Full 701-record Sanskrit/English source browser, exact verse lookup, in-memory conversations, saved verses, feedback and reset.
Gemini: use Connect Gemini to enter a NEW key in the private app, validate access and choose an available generateContent model. Key stays in page memory only, sent via same-origin HTTPS header and forwarded server-side to Google. Closing/refeshing/disconnecting clears it; no persistent key storage. Optional hosted secrets GEMINI_API_KEY and GEMINI_MODEL support server configuration. Never put credentials in source.

AI retrieval planning translates/resolves the question and proposes candidate references; only existing source records are loaded. The explanation call sees the actual retrieved text and must return source-linked sections. Hindi, Hinglish, English and three detail levels are supported. Last six turns are included, bounded to 2,000 characters per turn. This is AI-assisted retrieval, not vector embeddings. Citation validation is structural, not proof of interpretation. Quota/auth/invalid output failures show a clear notice and prepared fallback. Model access validation does not establish free-tier eligibility.


## Remaining before production
Translation-specific licensing review (see SOURCE.md); Sanskrit and interpretation review; embeddings and semantic retrieval; broader human grounding/safety evaluation; persistent abuse throttling before widening access; performance and browser QA. Gemini is tested with mocked API responses; live generation awaits a replacement key. Prepared reflections are editorial and not personalized AI. Feedback is session-only and is not transmitted for analysis. No application database or analytics trackers. Server/AI providers may retain operational data under their policies. Google Fonts is used.
