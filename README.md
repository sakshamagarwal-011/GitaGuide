# GitaGuide
A conversational Bhagavad Gita companion with source-backed explanations, OpenRouter integration, Sanskrit and English verse cards, and Krishna mode with looping music.

## Launch locally
Requires Node.js 22 or newer. No dependency installation is needed.

```sh
git clone https://github.com/sakshamagarwal-011/GitaGuide.git
cd GitaGuide
cp .env.example .env
```
Edit `.env` and set `OPENROUTER_API_KEY` to your own key. Then run:

```sh
npm start
```
Open http://localhost:3000. The server loads `.env`, builds the app and serves it. The browser never receives the server key. `.env` is excluded from Git; `.env.example` contains placeholders only. Revoke exposed keys and replace the local/hosted value.

## Host on a Node.js server
Use Node.js 22+, set `OPENROUTER_API_KEY`, `OPENROUTER_MODEL` (default `openrouter/free`) and optionally `PORT` in your host's secret/environment settings. Start with `npm start`. Do not upload `.env` to GitHub. This app needs a backend; GitHub Pages cannot run its AI endpoints.

## Sites hosting
`npm run build` emits the Cloudflare Worker at `dist/server/index.js`. Configure `OPENROUTER_API_KEY` as a hosted runtime secret and redeploy. Local `.env` is used only by the Node launcher; the Worker reads runtime environment bindings. Keep `.openai/hosting.json` for the existing Sites deployment.

## Checks
```sh
npm run build
npm test
```

## Data and behavior
701 verse records across 18 chapters; English translation attributed to Shri Purohit Swami. See SOURCE.md and LICENSE-SOURCE.txt for provenance and licensing review limitations. Model explanations use retrieved text with validated citation IDs; validation does not guarantee interpretive accuracy. Conversations and bookmarks stay in page memory. OpenRouter and its selected provider process questions and context. Free model availability and quotas vary. Gemini remains an optional session connection. Music and feather animation are enabled through Krishna mode.
