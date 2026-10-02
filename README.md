<div align="center">

# 🛡️ Scam Shield

### A calm, real-time scam-warning assistant for older adults

**Gemini for live call audio · Gemma for suspicious messages · Built for SFS x GDG Hackathon**

<br />

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![Gemini](https://img.shields.io/badge/Gemini-2.5%20Flash-4285F4?logo=google)](https://ai.google.dev/)
[![Gemma](https://img.shields.io/badge/Gemma-4-34A853?logo=google)](https://ai.google.dev/gemma)
[![Google Cloud](https://img.shields.io/badge/Google%20Cloud-Run-4285F4?logo=googlecloud)](https://cloud.google.com/run)

</div>

---

> **Pause. Check. Feel confident.**  
> Scam Shield turns confusing calls and messages into a calm risk assessment with one clear next step.

---
## 🧠 Backend & AI

> **Two checks, one calm answer.**

| Input | AI path | What it checks |
|---|---|---|
| 💬 Text, links | **Gemma 4** via Gemini API | Urgency, impersonation, suspicious links, payment or code requests |
| 🎙️ Live call audio | **Gemini 2.5 Flash** on Vertex AI | Pressure, secrecy, threats, payment demands, and verification-code requests |

Both paths return the same result: `risk_level`, `red_flags`, `plain_explanation`, and `recommended_action`.

- 🟡 One unclear or social-engineering sign → `caution`
- 🔴 Multiple signs, or gift cards, wire/crypto, one-time codes, or “don’t tell anyone” → `high`
- ⚠️ If analysis fails, the backend safely returns `caution`—never `low`
- 🔒 Audio and messages are processed transiently and are not stored
