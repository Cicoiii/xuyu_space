import React, { useCallback, useEffect, useState } from 'react';
import { Button, Card, Icon } from '@capital/component';
import {
  showErrorToasts,
  showSuccessToasts,
  showToasts,
} from '@capital/common';
import styled from 'styled-components';
import { pluginRequest } from './request';

interface PublicLLMConfig {
  providerName: string;
  apiUrl: string;
  chatModel: string;
  thinkModel: string;
  configured: boolean;
  apiKeyMasked: string;
}

const FLASH_MODEL = 'deepseek-v4-flash';

const defaultConfig: PublicLLMConfig = {
  providerName: 'DeepSeek',
  apiUrl: 'https://api.deepseek.com/v1',
  chatModel: FLASH_MODEL,
  thinkModel: FLASH_MODEL,
  configured: false,
  apiKeyMasked: '',
};

const providerPresets = [
  {
    name: 'DeepSeek',
    apiUrl: 'https://api.deepseek.com/v1',
    chatModel: FLASH_MODEL,
    thinkModel: FLASH_MODEL,
  },
];

const Root = styled.div`
  max-width: 760px;
  color: var(--tc-text-color);

  .settings-header {
    margin-bottom: 16px;
  }

  .settings-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 18px;
    font-weight: 600;
  }

  .settings-desc {
    margin-top: 6px;
    color: var(--tc-text-muted-color);
    line-height: 1.6;
  }

  .settings-card {
    background: var(--tc-surface-panel-color);
    border: 1px solid var(--tc-border-color);
    border-radius: 8px;
  }

  .settings-section {
    padding: 14px 0;
    border-bottom: 1px solid var(--tc-border-soft-color);
  }

  .settings-section:first-child {
    padding-top: 0;
  }

  .settings-section:last-child {
    border-bottom: 0;
    padding-bottom: 0;
  }

  .settings-section-title {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 10px;
  }

  .preset-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .form-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
  }

  .form-field.full {
    grid-column: 1 / -1;
  }

  .field-label {
    color: var(--tc-text-secondary-color);
    font-size: 12px;
  }

  .field-input {
    width: 100%;
    min-width: 0;
    height: 34px;
    padding: 0 10px;
    color: var(--tc-text-color);
    background: var(--tc-surface-color);
    border: 1px solid var(--tc-border-color);
    border-radius: 6px;
    outline: none;
  }

  .field-input:focus {
    border-color: var(--tc-primary-color);
  }

  .field-tip {
    color: var(--tc-text-muted-color);
    font-size: 12px;
    line-height: 1.5;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 14px;
  }

  .status-line {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--tc-text-secondary-color);
    font-size: 13px;
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #ef4444;
  }

  .status-dot.ready {
    background: #22c55e;
  }

  @media (max-width: 720px) {
    .form-grid {
      grid-template-columns: 1fr;
    }
  }
`;

const SettingsPanel: React.FC = React.memo(() => {
  const [config, setConfig] = useState<PublicLLMConfig>(defaultConfig);
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  const loadConfig = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await pluginRequest.get('getConfig');
      setConfig({
        ...defaultConfig,
        ...(data ?? {}),
      });
      setApiKey('');
    } catch (err) {
      showErrorToasts(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  const updateField = (field: keyof PublicLLMConfig, value: string) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const applyPreset = (preset: (typeof providerPresets)[number]) => {
    setConfig((prev) => ({
      ...prev,
      providerName: preset.name,
      apiUrl: preset.apiUrl,
      chatModel: FLASH_MODEL,
      thinkModel: FLASH_MODEL,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: Record<string, string> = {
        providerName: config.providerName,
        apiUrl: config.apiUrl,
        chatModel: FLASH_MODEL,
        thinkModel: FLASH_MODEL,
      };

      if (apiKey.trim()) {
        payload.apiKey = apiKey.trim();
      }

      const { data } = await pluginRequest.post('updateConfig', payload);
      setConfig({
        ...defaultConfig,
        ...(data ?? {}),
      });
      setApiKey('');
      showSuccessToasts();
    } catch (err) {
      showErrorToasts(err);
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    try {
      const { data } = await pluginRequest.post('testConfig', {
        content: '请用一句话回复：小序助手配置连接成功。',
      });

      if (data?.result) {
        showToasts(data.answer || '连接测试成功', 'success');
      } else {
        showToasts(data?.answer || '连接测试失败', 'error');
      }
    } catch (err) {
      showErrorToasts(err);
    } finally {
      setTesting(false);
    }
  };

  return (
    <Root>
      <div className="settings-header">
        <div className="settings-title">
          <Icon icon="mdi:tune-variant" />
          小序助手高级设置
        </div>
        <div className="settings-desc">
          AI 助手已限制为 Flash 模型调用，避免使用 Pro 或推理模型。
        </div>
      </div>

      <Card className="settings-card" bordered={false}>
        <div className="settings-section">
          <div className="settings-section-title">服务商预设</div>
          <div className="preset-row">
            {providerPresets.map((preset) => (
              <Button key={preset.name} onClick={() => applyPreset(preset)}>
                {preset.name}
              </Button>
            ))}
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section-title">连接配置</div>
          <div className="form-grid">
            <label className="form-field">
              <span className="field-label">服务商名称</span>
              <input
                className="field-input"
                value={config.providerName}
                disabled={loading}
                placeholder="例如 Qwen / OpenAI / DeepSeek"
                onChange={(event) =>
                  updateField('providerName', event.target.value)
                }
              />
            </label>

            <label className="form-field">
              <span className="field-label">普通模型</span>
              <input
                className="field-input"
                value={FLASH_MODEL}
                disabled
                placeholder={FLASH_MODEL}
                readOnly
              />
            </label>

            <label className="form-field full">
              <span className="field-label">API 地址</span>
              <input
                className="field-input"
                value={config.apiUrl}
                disabled={loading}
                placeholder="https://api.openai.com/v1"
                onChange={(event) => updateField('apiUrl', event.target.value)}
              />
              <span className="field-tip">
                填写到 /v1 即可，系统会自动请求 /chat/completions。
              </span>
            </label>

            <label className="form-field">
              <span className="field-label">思考模型</span>
              <input
                className="field-input"
                value={FLASH_MODEL}
                disabled
                placeholder={FLASH_MODEL}
                readOnly
              />
              <span className="field-tip">
                已锁定为 Flash，保存时不会写入 Pro 模型。
              </span>
            </label>

            <label className="form-field">
              <span className="field-label">API Key</span>
              <input
                className="field-input"
                type="password"
                value={apiKey}
                disabled={loading}
                placeholder={
                  config.configured
                    ? `保持当前 Key (${config.apiKeyMasked})`
                    : '请输入 API Key'
                }
                onChange={(event) => setApiKey(event.target.value)}
              />
              <span className="field-tip">
                留空保存时会继续使用当前 Key，不会清除已有配置。
              </span>
            </label>
          </div>
        </div>

        <div className="settings-section">
          <div className="status-line">
            <span
              className={
                config.configured ? 'status-dot ready' : 'status-dot'
              }
            />
            {config.configured
              ? `已配置 API Key：${config.apiKeyMasked}`
              : '尚未配置 API Key'}
          </div>

          <div className="actions">
            <Button type="primary" loading={saving} disabled={loading} onClick={handleSave}>
              保存配置
            </Button>
            <Button loading={testing} disabled={loading || saving} onClick={handleTest}>
              测试连接
            </Button>
            <Button disabled={loading || saving} onClick={loadConfig}>
              重新读取
            </Button>
          </div>
        </div>
      </Card>
    </Root>
  );
});
SettingsPanel.displayName = 'SettingsPanel';

export default SettingsPanel;
