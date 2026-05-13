import { pluginInspectServices } from '@/plugin/common';
import { Icon } from 'tailchat-design';
import React, { useMemo } from 'react';
import { t, useAvailableServices } from 'tailchat-shared';
import { Loading } from '@/components/Loading';
import styles from '@/components/FullModal/FullModal.module.less';

/**
 * 默认检查服务列表
 */
const DEFAULT_SERVICES = [
  {
    name: 'config',
    label: t('全局配置'),
  },
  {
    name: 'gateway',
    label: t('服务网关'),
  },
  {
    name: 'user',
    label: t('用户服务'),
  },
  {
    name: 'user.dmlist',
    label: t('私信服务'),
  },
  {
    name: 'chat.message',
    label: t('聊天服务'),
  },
  {
    name: 'chat.converse',
    label: t('会话服务'),
  },
  {
    name: 'chat.ack',
    label: t('已读服务'),
  },
  {
    name: 'friend',
    label: t('好友服务'),
  },
  {
    name: 'group',
    label: t('群组服务'),
  },
  {
    name: 'group.invite',
    label: t('群组邀请服务'),
  },
  {
    name: 'file',
    label: t('文件服务'),
  },
  {
    name: 'mail',
    label: t('邮件服务'),
  },
  {
    name: 'plugin.registry',
    label: t('插件中心服务'),
  },
];

/**
 * 服务状态
 */
export const SettingsStatus: React.FC = React.memo(() => {
  const inspectServices = useMemo(
    () => [...DEFAULT_SERVICES, ...pluginInspectServices],
    []
  );

  const { loading, availableServices, refetch } = useAvailableServices();

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <button
          className={styles.btnPrimary}
          onClick={refetch}
          style={{ opacity: loading ? 0.6 : 1 }}
        >
          {loading ? t('加载中...') : t('刷新')}
        </button>
      </div>

      <Loading spinning={loading}>
        {inspectServices.map((service) => (
          <div key={service.name} className={styles.statusRow}>
            <span className={styles.statusLabel}>{service.label}</span>
            {availableServices?.includes(service.name) ? (
              <span className={styles.statusOk} title={t('当前服务可用')}>
                <Icon icon="mdi:check-circle" />
              </span>
            ) : (
              <span className={styles.statusErr} title={t('服务异常')}>
                <Icon icon="mdi:close-circle" />
              </span>
            )}
          </div>
        ))}
      </Loading>
    </div>
  );
});
SettingsStatus.displayName = 'SettingsStatus';
