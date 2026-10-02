<div align="center">

# 🛡️ Scam Shield

### A calm, real-time scam-warning assistant for older adults

**Gemini for live call audio · Gemma for suspicious messages · Built for SFS x GDG AI Hackathon 2026**

Created by Ananya Navale & Yoomi Kim

<br />

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![Gemini](https://img.shields.io/badge/Gemini-2.5%20Flash-4285F4?logo=google)](https://ai.google.dev/)
[![Gemma](https://img.shields.io/badge/Gemma-4-34A853?logo=google)](https://ai.google.dev/gemma)
[![Google Cloud](https://img.shields.io/badge/Google%20Cloud-Run-4285F4?logo=googlecloud)](https://cloud.google.com/run)

</div>

---

> **Pause. Check. Feel confident.**  
> Scam Shield turns confusing calls and messages into a calm risk assessment with clear next steps.

---

## 🖥️ Frontend

Live demo: [scam-shield-i7qu2ib6dq-uc.a.run.app](https://scam-shield-i7qu2ib6dq-uc.a.run.app)

The page is a client component in the Next.js App Router. It keeps one tab in state and renders either the call monitor or the message checker inside a card that is locked to the viewport. Long results scroll inside that card. The disclosure lines sit under both cards, so the page itself does not scroll.

| Screen | How it runs | What you see |
|---|---|---|
| 🎙️ Listen to a call | `MediaRecorder` restarts about every 7 seconds so each clip has its own header. The last 3 clips stay in memory and are posted as multipart `audio` files. A new window is skipped while one request is still in flight | A risk meter that steps up immediately and steps down only after two calmer checks |
| 💬 Check a message | The pasted text is posted as JSON to `/api/analyze-text`, unless `NEXT_PUBLIC_USE_MOCK` is not `"false"`. When the result arrives, the card scrolls to it | The same meter, the warning signs, and one next step |

- 🟢 **Looks okay** · 🟡 **Be careful** · 🔴 **Warning signs** are labels on `low`, `caution`, and `high`. The bar is visual only. The level is also announced in text
- ⚠️ If the result has `error: true`, the meter is hidden and the screen says **We couldn’t check this one**. A failed call check also leaves the current meter where it is
- 👨‍👩‍👧 `useSmoothedRisk` holds the level shown on a call. On `caution` or `high`, a labeled panel renders the text that would go to Maria. That string is local. Nothing is sent
- 🎙️ The mic is opened with echo cancellation and noise suppression off, so a call on speaker is not stripped out before it is recorded
- ⌨️ The two choices are a tablist. Arrow keys move between them, and only the selected tab is in the tab order. Focus uses an amber ring, and motion is skipped when reduced motion is on
- 🔤 Body text is Quicksand. The two headlines are Georgia

---

## 🧠 Backend & AI

Text and audio are separate server routes. Both call `generateContent`, ask for JSON, and parse it into the same `AnalysisResult`. The browser never holds an API key.

| Input | How the request runs | Model |
|---|---|---|
| 💬 Text, links | `POST /api/analyze-text` reads JSON `{ text, imageBase64?, imageMimeType? }`, checks size, and sends the text prompt plus the message. An optional image is attached as inline data | **Gemma 4** (`gemma-4-26b-a4b-it`) through the Gemini API, using `GEMINI_API_KEY` |
| 🎙️ Live call audio | `POST /api/analyze-audio` reads 1–4 multipart files named `audio`, oldest first, and rejects empty or oversized clips. Each clip is sent as inline audio, then the audio prompt | **Gemini 2.5 Flash** on Vertex AI, using the Cloud Run service account |

- 🟡 The text prompt maps one social-engineering sign, such as a lookalike link, pressure to act today, or a new family number, to `caution`
- 🔴 Several signs, or gift cards, wire, crypto, a one-time code, or “don’t tell anyone,” map to `high`. `low` is only for text with none of those signs
- 🌡️ Text generation uses `temperature: 0.2` and `responseMimeType: application/json`. Gemma’s thinking cannot be turned off, so a message check often takes around 20 seconds
- 🧩 `parseModelJson` checks `risk_level`, `red_flags`, `plain_explanation`, and `recommended_action`. A bad payload or a thrown request becomes `FALLBACK_RESULT`: HTTP 200, `risk_level: caution`, and `error: true`. It never answers `low` on failure
- 🔒 The routes do not write the message or the audio anywhere. Logs keep the error message, not the content that was checked

---

## 🛠️ Tools

> **Frames in Figma Make. The app in Cursor.**

| Tool | What it was for |
|---|---|
| [Figma Make](https://www.figma.com/make/) | Two desktop frames: the idle call screen, and the message screen after a scam sample has been checked. Those frames set the forest-green panel, the white card, the serif headlines, and the pill tabs |
| [Cursor](https://cursor.com/) | The Next.js app itself: the call and message screens, the risk meter, accessibility, and the one-screen layout. The frames were the visual reference. The existing result states stayed in the code |

The message frame showed a result card that said the message may be a scam. The app does not use that wording. It keeps the progress-bar meter and the labels **Looks okay**, **Be careful**, and **Warning signs**.

---

## 🚀 Local setup

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env.local`
3. Set `NEXT_PUBLIC_USE_MOCK=false` when you want real checks. Leave it unset to use sample answers
4. Fill in the backend values in `.env.local` on the machine that runs the server. Do not prefix those with `NEXT_PUBLIC_`
5. Start the app: `npm run dev`, then open [http://localhost:3000](http://localhost:3000) in Chrome

`.env.local` is gitignored. Do not commit API keys.

---

## ⚠️ Current Limitations

- Scam Shield gives guidance, not a guarantee
- Message checks can take about 20 seconds because Gemma thinks before it answers
- The microphone path is meant for Chrome, with the call on speaker. For a demo, play the recording from a phone next to the laptop
- Sample mode rarely returns **Be careful**. It mostly categorizes messages into **Looks okay** or **Warning**
- The family note is a demo simulation. Nothing is sent to a real phone

---

## 🌱 Future Improvements and Aspirations

- Automatically send an approved family member a real text (after receiving consent) in the cases of medium-to-high danger live audio detection
- Shorten/optimize message checks if the model allows it
- Improve accuracy and robustness for message investigation, including email upload and send address oddities
- Offer an installable home-screen app or Chrome extension/plugin
