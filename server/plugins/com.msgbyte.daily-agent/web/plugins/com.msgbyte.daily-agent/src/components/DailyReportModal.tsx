import React, { useState, useCallback } from 'react';
import { Button, Card, Icon } from '@capital/component';
import { createPluginRequest } from '@capital/common';

const request = createPluginRequest('com.msgbyte.daily-agent');

interface Channel {
  id: string;
  name: string;
  type: string;
}

export const DailyReportModal: React.FC<{
  visible: boolean;
  onClose: () => void;
}> = ({ visible, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);

  const loadChannels = useCallback(async () => {
    try {
      const data = await request.get('listChannels');
      if (data?.list) {
        setChannels(data.list);
      }
    } catch (err) {
      console.error('Failed to load channels:', err);
    }
  }, []);

  React.useEffect(() => {
    if (visible) {
      loadChannels();
    }
  }, [visible, loadChannels]);

  const handleGenerate = async () => {
    if (selectedChannels.length === 0) {
      alert('请选择至少一个频道');
      return;
    }

    setLoading(true);
    try {
      const result = await request.post('generateReport', {
        channelIds: selectedChannels,
        panelIds: [],
        date: new Date().toISOString().split('T')[0],
      });

      if (result.result) {
        setReport(result.report);
      } else {
        alert(result.error || '生成失败');
      }
    } catch (err: any) {
      alert(err.message || '生成失败');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setReport(null);
    setSelectedChannels([]);
    onClose();
  };

  const toggleChannel = (id: string) => {
    setSelectedChannels((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={handleClose}
    >
      <div
        style={{
          background: 'white',
          borderRadius: 8,
          width: 700,
          maxHeight: '80vh',
          overflow: 'auto',
          padding: 24,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
          📊 日报生成器
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Icon icon="mdi:loading" style={{ fontSize: 32 }} />
            <p style={{ marginTop: 16 }}>正在分析聊天记录...</p>
          </div>
        )}

        {!loading && !report && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ marginBottom: 8, fontWeight: 500 }}>选择频道:</div>
              <div
                style={{
                  maxHeight: 200,
                  overflow: 'auto',
                  border: '1px solid #ddd',
                  borderRadius: 4,
                  padding: 8,
                }}
              >
                {channels.map((ch) => (
                  <div
                    key={ch.id}
                    style={{
                      padding: '4px 8px',
                      cursor: 'pointer',
                      background: selectedChannels.includes(ch.id)
                        ? '#e6f7ff'
                        : 'transparent',
                      borderRadius: 4,
                    }}
                    onClick={() => toggleChannel(ch.id)}
                  >
                    {ch.name}
                  </div>
                ))}
              </div>
            </div>

            <Button type="primary" block onClick={handleGenerate}>
              生成日报
            </Button>
          </div>
        )}

        {!loading && report && (
          <div>
            <div
              style={{
                background: '#d4edda',
                padding: 8,
                borderRadius: 4,
                marginBottom: 16,
              }}
            >
              ✅ 日报生成完成
            </div>

            <Card size="small" title="📈 进度" style={{ marginBottom: 12 }}>
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                {(report.progress || []).map((item: string, i: number) => (
                  <li key={i} style={{ marginBottom: 8 }}>{item}</li>
                ))}
              </ul>
            </Card>

            <Card size="small" title="✅ 决策" style={{ marginBottom: 12 }}>
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                {(report.decisions || []).map((item: string, i: number) => (
                  <li key={i} style={{ marginBottom: 8 }}>{item}</li>
                ))}
              </ul>
            </Card>

            <Card size="small" title="🚧 阻碍" style={{ marginBottom: 12 }}>
              <ul style={{ paddingLeft: 20, margin: 0, color: '#dc3545' }}>
                {(report.blockers || []).map((item: string, i: number) => (
                  <li key={i} style={{ marginBottom: 8 }}>{item}</li>
                ))}
              </ul>
            </Card>

            <Card size="small" title="📋 待办" style={{ marginBottom: 12 }}>
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                {(report.todos || []).map((item: string, i: number) => (
                  <li key={i} style={{ marginBottom: 8 }}>{item}</li>
                ))}
              </ul>
            </Card>

            <Button block onClick={handleClose}>
              关闭
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
