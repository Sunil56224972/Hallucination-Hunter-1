import { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, HelpCircle } from 'lucide-react';

const STEP_LABELS = {
  extracting: 'Extracting factual claims…',
  verifying: 'Cross-referencing each claim…',
  scoring: 'Computing reliability scores…',
  done: 'Analysis complete',
};

const STEP_ORDER = ['extracting', 'verifying', 'scoring', 'done'];

export default function LoadingState({ currentStep }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const currentIndex = STEP_ORDER.indexOf(currentStep);

  return (
    <div className="loading-overlay">
      <div className="spinner" />
      <p className="loading-text">Analyzing your text for hallucinations</p>
      <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
        {elapsed}s elapsed
      </p>
      <div className="loading-steps">
        {STEP_ORDER.filter((s) => s !== 'done').map((step, i) => {
          let status = 'pending';
          if (i < currentIndex) status = 'done';
          else if (i === currentIndex) status = 'active';

          return (
            <div key={step} className={`loading-step ${status}`}>
              <span className="step-icon">
                {status === 'done' ? '✓' : status === 'active' ? '›' : '·'}
              </span>
              {STEP_LABELS[step]}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ================================ */

export function ResultsPanel({ results }) {
  if (!results) return null;

  const { overall_score, total_claims, verified_claims, suspicious_claims, fabricated_claims, claims } = results;

  const scorePercent = Math.round(overall_score * 100);
  const scoreColor =
    scorePercent >= 75 ? 'var(--verified)' :
    scorePercent >= 45 ? 'var(--suspicious)' :
    'var(--fabricated)';

  const circumference = 2 * Math.PI * 34;
  const offset = circumference - (overall_score * circumference);

  return (
    <div className="results-section">
      <div className="results-header">
        <div>
          <h2>Analysis Results</h2>
          <p style={{ fontSize: '0.875rem', marginTop: '4px' }}>
            {total_claims} claim{total_claims !== 1 ? 's' : ''} extracted and verified
          </p>
        </div>
        <div className="score-ring">
          <svg viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="34" fill="none" stroke="var(--border-subtle)" strokeWidth="4" />
            <circle
              cx="40" cy="40" r="34"
              fill="none"
              stroke={scoreColor}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 1s var(--ease-out)' }}
            />
          </svg>
          <span className="score-value" style={{ color: scoreColor }}>
            {scorePercent}
          </span>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card total">
          <span className="stat-label">Total Claims</span>
          <span className="stat-value">{total_claims}</span>
        </div>
        <div className="stat-card verified">
          <span className="stat-label">Verified</span>
          <span className="stat-value">{verified_claims}</span>
        </div>
        <div className="stat-card suspicious">
          <span className="stat-label">Suspicious</span>
          <span className="stat-value">{suspicious_claims}</span>
        </div>
        <div className="stat-card fabricated">
          <span className="stat-label">Fabricated</span>
          <span className="stat-value">{fabricated_claims}</span>
        </div>
      </div>

      <div className="claims-list">
        {claims.map((claim, index) => (
          <ClaimCard key={index} claim={claim} index={index} />
        ))}
      </div>
    </div>
  );
}

/* ================================ */

function ClaimCard({ claim, index }) {
  const VerdictIcon = {
    verified: CheckCircle2,
    suspicious: AlertTriangle,
    fabricated: XCircle,
    unverifiable: HelpCircle,
  }[claim.verdict] || HelpCircle;

  const confidence = Math.round((claim.confidence || 0) * 100);

  return (
    <div className={`claim-card verdict-${claim.verdict}`}>
      <div className="claim-header">
        <p className="claim-text">
          <span style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', marginRight: '8px' }}>
            #{index + 1}
          </span>
          {claim.claim_text}
        </p>
        <span className={`verdict-badge ${claim.verdict}`}>
          <VerdictIcon size={12} />
          {claim.verdict}
        </span>
      </div>

      {claim.explanation && (
        <p className="claim-explanation">{claim.explanation}</p>
      )}

      <div className="confidence-bar-wrapper">
        <div className="confidence-bar-label">
          <span>Confidence</span>
          <span style={{ fontFamily: 'var(--font-mono)' }}>{confidence}%</span>
        </div>
        <div className="confidence-bar">
          <div
            className={`confidence-bar-fill ${claim.verdict}`}
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>
    </div>
  );
}
