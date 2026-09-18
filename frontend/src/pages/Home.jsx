import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Crosshair, Shield, Zap } from 'lucide-react';
import AnalyzerInput from '../components/AnalyzerInput';
import LoadingState, { ResultsPanel } from '../components/ResultsPanel';
import { analyzeText } from '../api/analyzer';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

export default function Home() {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('extracting');
  const [error, setError] = useState(null);

  const handleAnalyze = useCallback(async (text) => {
    setIsLoading(true);
    setResults(null);
    setError(null);
    setLoadingStep('extracting');

    try {
      const result = await analyzeText(text, (step) => setLoadingStep(step));
      setResults(result);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <motion.div className="page-wrapper" variants={pageVariants} initial="initial" animate="animate">
      <div className="container">
        <section className="hero">
          <div className="hero-badge">
            <Crosshair size={12} />
            LLM Hallucination Detection
          </div>
          <h1>
            Verify the facts in<br />
            <span className="highlight">AI-generated text</span>
          </h1>
          <p>
            Paste any LLM output and get a detailed reliability report. Each factual claim is extracted, cross-referenced, and scored individually.
          </p>
        </section>

        <AnalyzerInput onAnalyze={handleAnalyze} isLoading={isLoading} />

        {isLoading && <LoadingState currentStep={loadingStep} />}

        {error && (
          <div className="toast error" style={{ position: 'relative', margin: '24px auto 0', maxWidth: '560px', bottom: 'auto', right: 'auto' }}>
            <span style={{ color: 'var(--fabricated)' }}>⚠</span>
            {error}
          </div>
        )}

        {results && <ResultsPanel results={results} />}

        {!isLoading && !results && (
          <section style={{ marginTop: '64px' }}>
            <div className="stats-row" style={{ maxWidth: '720px', margin: '0 auto' }}>
              <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
                <div style={{ color: 'var(--accent)', marginBottom: '12px' }}>
                  <Shield size={24} />
                </div>
                <h4 style={{ marginBottom: '6px', fontSize: '0.9375rem' }}>Claim-Level Analysis</h4>
                <p style={{ fontSize: '0.8125rem' }}>
                  Each factual claim is extracted and verified independently for maximum accuracy.
                </p>
              </div>
              <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
                <div style={{ color: 'var(--accent)', marginBottom: '12px' }}>
                  <Crosshair size={24} />
                </div>
                <h4 style={{ marginBottom: '6px', fontSize: '0.9375rem' }}>Confidence Scoring</h4>
                <p style={{ fontSize: '0.8125rem' }}>
                  Every verdict comes with a confidence percentage so you know what to trust.
                </p>
              </div>
              <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
                <div style={{ color: 'var(--accent)', marginBottom: '12px' }}>
                  <Zap size={24} />
                </div>
                <h4 style={{ marginBottom: '6px', fontSize: '0.9375rem' }}>Powered by Groq</h4>
                <p style={{ fontSize: '0.8125rem' }}>
                  Ultra-fast inference using Llama 3.3 70B on Groq's LPU hardware.
                </p>
              </div>
            </div>
          </section>
        )}
      </div>
    </motion.div>
  );
}
