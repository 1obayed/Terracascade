'use client';
import { useState } from 'react';
import { Sparkles, Send } from 'lucide-react';
import { Modal } from '@/components/ui';
import { explain } from '@/lib/explain';
import { PREVIEW_LABEL } from '@/lib/ai-preview';
import { ScenarioSuggestions } from './ai-preview';
import type { EarthEvent, Evidence, Forecast, Mode, Scenario } from '@/data/types';
export function AskTerra({
  event,
  result,
  scenario,
  mode,
  observation,
  onClose,
  onEvidence,
  onHeavyRain,
  onScenario,
}: {
  event: EarthEvent;
  result: Forecast;
  scenario: Scenario;
  mode: Mode;
  observation: number;
  onClose: () => void;
  onEvidence: (e: Evidence) => void;
  onHeavyRain: () => void;
  onScenario: (scenario: Scenario) => void;
}) {
  const [question, setQuestion] = useState('');
  const [asked, setAsked] = useState('What changed here?');
  const answer = explain(asked, event, result, scenario, mode, observation);
  return (
    <Modal title="Ask Terra" onClose={onClose} className="ask-modal" scrollBody={false}>
      <div className="ask-scroll">
        <div className="ask-context">
          <Sparkles size={23} />
          <div>
            <strong>{event.name}</strong>
            <p>
              NISAR {event.product} · {mode.toUpperCase()} · +{scenario.horizon}D
            </p>
          </div>
        </div>
        <span className="ai-preview-badge">{PREVIEW_LABEL}</span>
        <p className="fine-print ai-disclosure">
          This interactive prototype uses local explanation rules, not a connected language model.
          Answers update with your selected evidence and scenario. AI model integration is planned.
        </p>
        <div className="ask-suggestions">
          {[
            'What changed here?',
            'What should I watch next?',
            'Why is this forecast uncertain?',
            'Show a heavy-rain scenario.',
          ].map((q) => (
            <button key={q} onClick={() => setAsked(q)} className={asked === q ? 'selected' : ''}>
              {q}
            </button>
          ))}
        </div>
        <div className="ask-answer" aria-live="polite">
          <h3>{asked}</h3>
          <p>{answer.text}</p>
          <div className="answer-sources">
            {answer.evidence.map((i) => (
              <button key={i} onClick={() => onEvidence(event.evidence[i])}>
                {event.evidence[i].label}
              </button>
            ))}
          </div>
          {answer.action && (
            <button
              className="button small dark"
              onClick={() => {
                onHeavyRain();
                setAsked('What should I watch next?');
              }}
            >
              Apply heavy rain
            </button>
          )}
        </div>
        <details className="ai-suggestion-details">
          <summary>Explore suggested scenarios</summary>
          <ScenarioSuggestions
            event={event}
            scenario={scenario}
            onApply={(next) => {
              onScenario(next);
              setAsked('What should I watch next?');
            }}
          />
        </details>
      </div>
      <form
        className="ask-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (question.trim()) {
            setAsked(question.trim().slice(0, 500));
            setQuestion('');
          }
        }}
      >
        <label className="sr-only" htmlFor="terra-question">
          Question about this evidence
        </label>
        <input
          id="terra-question"
          autoComplete="off"
          value={question}
          maxLength={500}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about this signal…"
        />
        <button
          type="submit"
          className="icon-button"
          disabled={!question.trim()}
          aria-label="Ask question"
        >
          <Send size={17} />
        </button>
      </form>
    </Modal>
  );
}
