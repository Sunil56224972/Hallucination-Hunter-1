import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Clock, FileText, ChevronRight, Inbox } from 'lucide-react';
import { getHistory } from '../api/analyzer';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now - d;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getScoreClass(score) {
  const pct = Math.round((score || 0) * 100);
  if (pct >= 75) return 'high';
  if (pct >= 45) return 'medium';
  return 'low';
}

export default function HistoryPage() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      setLoading(true);
      const { data } = await getHistory(30, 0);
      setAnalyses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div className="page-wrapper" variants={pageVariants} initial="initial" animate="animate">
      <div className="container">
        <div className="history-header">
          <h1>Analysis History</h1>
          <p>Browse your past hallucination analyses</p>
        </div>

        {loading ? (
          <div className="loading-overlay">
            <div className="spinner" />
            <p className="loading-text">Loading history…</p>
          </div>
        ) : error ? (
          <div className="toast error" style={{ position: 'relative', margin: '24px auto 0', maxWidth: '560px', bottom: 'auto', right: 'auto' }}>
            <span style={{ color: 'var(--fabricated)' }}>⚠</span>
            {error}
          </div>
        ) : analyses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Inbox size={28} />
            </div>
            <h3>No analyses yet</h3>
            <p>Run your first hallucination check from the analyzer page to see results here.</p>
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              Go to Analyzer
            </button>
          </div>
        ) : (
          <div className="history-list">
            {analyses.map((item) => (
              <div
                key={item.id}
                className="history-item"
                onClick={() => navigate(`/?id=${item.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigate(`/?id=${item.id}`)}
              >
                <div className={`history-score ${getScoreClass(item.overall_score)}`}>
                  {Math.round((item.overall_score || 0) * 100)}
                </div>
                <div className="history-content">
                  <div className="history-preview">
                    {item.input_text?.substring(0, 120)}
                    {item.input_text?.length > 120 ? '…' : ''}
                  </div>
                  <div className="history-meta">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={11} />
                      {formatDate(item.created_at)}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FileText size={11} />
                      {item.total_claims || 0} claims
                    </span>
                    <span>
                      {item.verified_claims || 0} ✓ / {item.suspicious_claims || 0} ⚠ / {item.fabricated_claims || 0} ✗
                    </span>
                  </div>
                </div>
                <ChevronRight size={16} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
