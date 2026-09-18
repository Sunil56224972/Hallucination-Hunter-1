import { motion } from 'framer-motion';
import { Brain, Target, BarChart3, Database, Zap, Shield } from 'lucide-react';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

export default function About() {
  return (
    <motion.div className="page-wrapper" variants={pageVariants} initial="initial" animate="animate">
      <div className="container" style={{ maxWidth: '720px' }}>
        <div style={{ marginBottom: '48px' }}>
          <h1 style={{ marginBottom: '12px' }}>How It Works</h1>
          <p style={{ fontSize: '1.0625rem' }}>
            Hallucination Hunter uses a multi-step AI pipeline to detect inaccurate or fabricated information in LLM-generated text.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <StepCard
            number="01"
            icon={<Brain size={20} />}
            title="Claim Extraction"
            description="The input text is analyzed by Llama 3.3 70B to identify individual factual claims — dates, statistics, named entities, causal relationships, and scientific assertions."
          />
          <StepCard
            number="02"
            icon={<Target size={20} />}
            title="Fact Verification"
            description="Each extracted claim is independently assessed for accuracy. The model cross-references claims against its training knowledge and flags inconsistencies."
          />
          <StepCard
            number="03"
            icon={<BarChart3 size={20} />}
            title="Confidence Scoring"
            description="Every verdict includes a confidence percentage. Claims are categorized as Verified, Suspicious, Fabricated, or Unverifiable with detailed explanations."
          />
          <StepCard
            number="04"
            icon={<Database size={20} />}
            title="Persistent Storage"
            description="All analyses are saved to a Supabase PostgreSQL database, letting you review past checks and track patterns over time."
          />
        </div>

        <div style={{ marginTop: '56px', padding: '28px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', backdropFilter: 'blur(12px)' }}>
          <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={18} style={{ color: 'var(--accent)' }} />
            Tech Stack
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            {[
              { label: 'LLM Engine', value: 'Groq (Llama 3.3 70B)', icon: '⚡' },
              { label: 'Frontend', value: 'React + Vite', icon: '⚛️' },
              { label: 'Backend', value: 'Supabase (PostgreSQL)', icon: '🗄️' },
              { label: 'Styling', value: 'Vanilla CSS', icon: '🎨' },
              { label: 'Animations', value: 'Framer Motion', icon: '✨' },
              { label: 'Icons', value: 'Lucide React', icon: '🎯' },
            ].map((item) => (
              <div key={item.label} style={{ padding: '12px 14px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.6875rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: '4px' }}>
                  {item.icon} {item.label}
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '40px', padding: '20px 24px', background: 'var(--accent-glow)', border: '1px solid var(--accent-border)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <Shield size={18} style={{ color: 'var(--accent)', marginTop: '2px', flexShrink: 0 }} />
            <div>
              <h4 style={{ fontSize: '0.875rem', marginBottom: '4px' }}>Important Disclaimer</h4>
              <p style={{ fontSize: '0.8125rem', lineHeight: 1.6 }}>
                This tool uses AI to check AI-generated text. While it can catch many inaccuracies, it is not infallible. Always verify critical information through authoritative primary sources.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StepCard({ number, icon, title, description }) {
  return (
    <div className="card" style={{ padding: '24px 28px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
      <div style={{
        width: '44px', height: '44px', borderRadius: 'var(--radius-md)',
        background: 'var(--accent-glow)', border: '1px solid var(--accent-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--accent)', flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-dim)', fontWeight: 600 }}>
            {number}
          </span>
          <h3 style={{ fontSize: '1rem' }}>{title}</h3>
        </div>
        <p style={{ fontSize: '0.875rem' }}>{description}</p>
      </div>
    </div>
  );
}
