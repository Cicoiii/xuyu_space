import { common, component, Button } from '@capital/component';
import { DailyReportModal } from './components/DailyReportModal';
import React, { useState } from 'react';

const Translate = {
  dailyReport: common.localTrans({ 'zh-CN': '日报生成', en: 'Daily Report' }),
  openTool: common.localTrans({ 'zh-CN': '打开日报工具', en: 'Open Tool' }),
};

common.regCustomPanel({
  position: 'personal',
  icon: 'mdi:chart-box-outline',
  name: 'com.msgbyte.daily-agent/report',
  label: Translate.dailyReport,
  render: () => <DailyReportPanel />,
});

const DailyReportPanel: React.FC = () => {
  const [visible, setVisible] = useState(false);

  return (
    <div style={{ padding: 16 }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h2>📊 日报生成器</h2>
        <p style={{ color: '#666' }}>
          基于群聊记录和项目文档，自动生成结构化日报
        </p>
      </div>

      <Button type="primary" size="large" block onClick={() => setVisible(true)}>
        {Translate.openTool}
      </Button>

      <DailyReportModal visible={visible} onClose={() => setVisible(false)} />
    </div>
  );
};

export default DailyReportPanel;
