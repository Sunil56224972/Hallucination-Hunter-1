# Hallucination Hunter

Detect and analyze hallucinations in AI-generated text. Powered by Groq's Llama 3.3 70B.

## Features

- **Claim Extraction** — Automatically identifies factual claims in any text
- **Fact Verification** — Each claim is independently assessed for accuracy
- **Confidence Scoring** — Verdicts include confidence percentages
- **History** — All analyses saved to Supabase for later review

## Tech Stack

- React + Vite
- Supabase (PostgreSQL)
- Groq API (Llama 3.3 70B)
- Vanilla CSS

## Getting Started

```bash
cd frontend
npm install
npm run dev
```

## License

MIT
