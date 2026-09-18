import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, RotateCcw } from 'lucide-react';

const EXAMPLE_TEXTS = [
  `The Eiffel Tower was built in 1887 by Gustave Eiffel for the World's Fair. It stands exactly 330 meters tall and was originally meant to be torn down after 20 years. The tower receives approximately 7 million visitors every year and has 1,665 steps to the top.`,
  `Python was created by Guido van Rossum and first released in 1991. It was named after Monty Python's Flying Circus. Python 3.0 was released in December 2008, and as of 2023, Python is the most popular programming language in the world according to the TIOBE Index.`,
  `The Great Wall of China is visible from space with the naked eye. It was built entirely during the Qin Dynasty around 220 BC. The wall stretches for approximately 13,170 miles and took over 2,000 years to complete, with an estimated 1 million workers dying during its construction.`,
];

export default function AnalyzerInput({ onAnalyze, isLoading }) {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onAnalyze(text.trim());
    }
  };

  const loadExample = () => {
    const example = EXAMPLE_TEXTS[Math.floor(Math.random() * EXAMPLE_TEXTS.length)];
    setText(example);
    textareaRef.current?.focus();
  };

  return (
    <div className="analyzer-container">
      <form onSubmit={handleSubmit}>
        <div className="analyzer-card">
          <div className="input-group">
            <label htmlFor="analyzer-input">Paste LLM-generated text to analyze</label>
            <textarea
              ref={textareaRef}
              id="analyzer-input"
              className="input-field"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste any AI-generated text here. The analyzer will extract factual claims and verify each one for accuracy..."
              disabled={isLoading}
            />
          </div>

          <div className="analyzer-footer">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className="char-count">{text.length} chars</span>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={loadExample}
                disabled={isLoading}
                title="Load example text"
              >
                <Sparkles size={14} />
                Try example
              </button>
              {text.length > 0 && (
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setText('')}
                  disabled={isLoading}
                >
                  <RotateCcw size={14} />
                  Clear
                </button>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div className="model-tag">
                <span className="dot" />
                llama3-70b
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!text.trim() || isLoading}
              >
                <Send size={15} />
                Analyze
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
