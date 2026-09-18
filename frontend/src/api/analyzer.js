const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama3-70b-8192';

async function callGroq(messages, temperature = 0.1) {
  const res = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature,
      max_tokens: 4096,
      response_format: { type: 'json_object' },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq API error: ${res.status} — ${err}`);
  }

  const data = await res.json();
  return JSON.parse(data.choices[0].message.content);
}

export async function analyzeText(inputText, onStep) {
  onStep?.('extracting');

  // Step 1: Extract claims
  const extractResult = await callGroq([
    {
      role: 'system',
      content: `You are an expert fact-checker and hallucination detector. Your job is to extract individual factual claims from the given text.

Extract each distinct factual claim that can be verified or fact-checked. Focus on:
- Specific facts, dates, numbers, statistics
- Named entities and their attributes
- Causal relationships
- Historical events
- Scientific claims

Return a JSON object with this structure:
{
  "claims": [
    { "text": "The extracted claim", "category": "factual|statistical|historical|scientific|attribution" }
  ]
}

If the text contains no verifiable claims, return { "claims": [] }.
Extract at most 10 claims. Be precise.`,
    },
    {
      role: 'user',
      content: inputText,
    },
  ]);

  const claims = extractResult.claims || [];

  if (claims.length === 0) {
    onStep?.('done');
    return {
      overall_score: 1.0,
      total_claims: 0,
      verified_claims: 0,
      suspicious_claims: 0,
      fabricated_claims: 0,
      claims: [],
    };
  }

  onStep?.('verifying');

  // Step 2: Verify each claim
  const claimTexts = claims.map((c, i) => `${i + 1}. "${c.text}"`).join('\n');

  const verifyResult = await callGroq([
    {
      role: 'system',
      content: `You are a meticulous fact-checker. For each claim provided, assess its factual accuracy based on your training knowledge.

For each claim, provide:
- verdict: one of "verified" (factually correct), "suspicious" (partially correct or misleading), "fabricated" (factually wrong), or "unverifiable" (cannot determine)
- confidence: a score from 0.0 to 1.0 indicating how confident you are
- explanation: a brief 1-2 sentence explanation of why you gave this verdict

Return a JSON object:
{
  "assessments": [
    {
      "claim_index": 1,
      "claim_text": "the original claim",
      "verdict": "verified|suspicious|fabricated|unverifiable",
      "confidence": 0.85,
      "explanation": "Brief explanation"
    }
  ]
}`,
    },
    {
      role: 'user',
      content: `Fact-check these claims:\n${claimTexts}`,
    },
  ]);

  onStep?.('scoring');

  const assessments = verifyResult.assessments || [];

  // Calculate scores
  let verified = 0, suspicious = 0, fabricated = 0, unverifiable = 0;
  const processedClaims = assessments.map((a) => {
    if (a.verdict === 'verified') verified++;
    else if (a.verdict === 'suspicious') suspicious++;
    else if (a.verdict === 'fabricated') fabricated++;
    else unverifiable++;

    return {
      claim_text: a.claim_text,
      verdict: a.verdict,
      confidence: Math.min(1, Math.max(0, a.confidence)),
      explanation: a.explanation,
    };
  });

  const total = processedClaims.length;
  const score =
    total > 0
      ? (verified * 1.0 + suspicious * 0.5 + unverifiable * 0.3) / total
      : 1.0;

  const result = {
    overall_score: Math.round(score * 100) / 100,
    total_claims: total,
    verified_claims: verified,
    suspicious_claims: suspicious,
    fabricated_claims: fabricated,
    claims: processedClaims,
  };

  onStep?.('done');
  return result;
}
