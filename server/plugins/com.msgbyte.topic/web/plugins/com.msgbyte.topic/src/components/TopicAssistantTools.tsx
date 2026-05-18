import { showToasts, useAsyncRequest } from '@capital/common';
import { Button, Icon, Markdown } from '@capital/component';
import React, { useState } from 'react';
import styled from 'styled-components';
import { assistantRequest } from '../request';
import { Translate } from '../translate';

type AssistantAction = 'improve' | 'shorter' | 'longer' | 'translate';

const Root = styled.div`
  position: relative;

  .assistant-trigger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    padding: 0;
    border: 1px solid var(--tc-border-color);
    color: var(--tc-text-secondary-color);
    background: transparent;
    border-radius: 8px;

    &:hover {
      border-color: var(--tc-primary-shadow-color);
      color: var(--tc-primary-color);
      background: var(--tc-primary-faint-color);
    }
  }

  .assistant-panel {
    position: absolute;
    right: 0;
    bottom: calc(100% + 8px);
    z-index: 20;
    width: 380px;
    max-width: min(380px, calc(100vw - 32px));
    border: 1px solid var(--tc-border-color);
    border-radius: 16px;
    background: var(--tc-surface-panel-color);
    overflow: hidden;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.04),
      0 8px 40px rgba(0, 0, 0, 0.08);
  }

  .assistant-title {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 16px 10px;
    color: var(--tc-text-color);
    font-weight: 600;
  }

  .assistant-title-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 8px;
    color: #fff;
    background: var(--tc-primary-color);
  }

  .assistant-body {
    padding: 0 16px 12px;
  }

  .assistant-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .assistant-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    border-radius: 20px;
    border: 1px solid var(--tc-border-color);
    color: var(--tc-text-secondary-color);
    background: transparent;

    &:hover {
      color: var(--tc-primary-color);
      border-color: var(--tc-primary-shadow-color);
      background: var(--tc-primary-faint-color);
    }
  }

  .assistant-result {
    margin-top: 10px;
    padding: 12px;
    max-height: 220px;
    overflow: auto;
    border-radius: 12px;
    background: var(--tc-surface-soft-color);
    color: var(--tc-text-color);
    line-height: 1.65;
  }

  .assistant-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 10px 16px 14px;
    border-top: 1px solid var(--tc-border-soft-color);
  }
`;

const actions: Array<{
  type: AssistantAction;
  label: string;
  icon: string;
}> = [
  { type: 'improve', label: Translate.improveText, icon: 'mdi:auto-fix' },
  {
    type: 'shorter',
    label: Translate.makeShorter,
    icon: 'mdi:arrow-collapse-horizontal',
  },
  {
    type: 'longer',
    label: Translate.makeLonger,
    icon: 'mdi:arrow-expand-horizontal',
  },
  { type: 'translate', label: Translate.translateText, icon: 'mdi:translate' },
];

export const TopicAssistantTools: React.FC<{
  value: string;
  onApply: (value: string) => void;
}> = React.memo((props) => {
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState('');

  const [{ loading }, handleRun] = useAsyncRequest(
    async (action: AssistantAction) => {
      const content = props.value.trim();

      if (!content) {
        showToasts(Translate.aiEmptyInput, 'warning');
        return;
      }

      const { data } = await assistantRequest.post('chat', {
        content,
        action,
      });

      if (data?.result && typeof data.answer === 'string') {
        setAnswer(data.answer);
      } else {
        showToasts(data?.answer || Translate.topicDataError, 'warning');
      }
    },
    [props.value, props.onApply]
  );

  return (
    <Root>
      <Button
        className="assistant-trigger"
        title={Translate.xiaoxuAssistant}
        onClick={() => setOpen((v) => !v)}
      >
        <Icon icon="mdi:creation" />
      </Button>

      {open && (
        <div className="assistant-panel">
          <div className="assistant-title">
            <span className="assistant-title-icon">
              <Icon icon="mdi:creation" />
            </span>
            <span>{loading ? Translate.aiThinking : Translate.xiaoxuAssistant}</span>
          </div>

          <div className="assistant-body">
            <div className="assistant-actions">
              {actions.map((item) => (
                <Button
                  className="assistant-chip"
                  key={item.type}
                  size="small"
                  disabled={loading}
                  onClick={() => handleRun(item.type)}
                >
                  <Icon icon={item.icon} />
                  {item.label}
                </Button>
              ))}
            </div>

            {answer && (
              <div className="assistant-result">
                <Markdown raw={answer} />
              </div>
            )}
          </div>

          {answer && (
            <div className="assistant-footer">
              <Button onClick={() => setAnswer('')}>{Translate.delete}</Button>
              <Button
                type="primary"
                onClick={() => {
                  props.onApply(answer);
                  setOpen(false);
                  setAnswer('');
                }}
              >
                {Translate.applyToInput}
              </Button>
            </div>
          )}
        </div>
      )}
    </Root>
  );
});
TopicAssistantTools.displayName = 'TopicAssistantTools';
