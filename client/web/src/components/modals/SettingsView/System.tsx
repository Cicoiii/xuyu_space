import { FullModalFactory } from '@/components/FullModal/Factory';
import { pluginSettings } from '@/plugin/common';
import { Button, Switch, Select } from 'antd';
import React from 'react';
import {
  t,
  useAlphaMode,
  useUserSettings,
  useColorScheme,
} from 'tailchat-shared';
import _get from 'lodash/get';
import styles from '@/components/FullModal/FullModal.module.less';

export const SettingsSystem: React.FC = React.memo(() => {
  const { settings, setSettings, loading } = useUserSettings();
  const { isAlphaMode, setAlphaMode } = useAlphaMode();
  const { colorScheme, setColorScheme } = useColorScheme();

  return (
    <div>
      <div className={styles.switchRow}>
        <div>
          <div className={styles.switchLabel}>{t('外观模式')}</div>
          <div className={styles.switchDesc}>
            {t('选择应用的主题外观，自动模式将跟随系统设置')}
          </div>
        </div>
        <Select
          value={colorScheme === 'dark' || colorScheme === 'light' || colorScheme === 'auto' ? colorScheme : 'dark'}
          onChange={(val) => setColorScheme(val)}
          style={{ minWidth: 100 }}
          options={[
            { label: t('深色模式'), value: 'dark' },
            { label: t('浅色模式'), value: 'light' },
            { label: t('跟随系统'), value: 'auto' },
          ]}
        />
      </div>

      <div className={styles.switchRow}>
        <div>
          <div className={styles.switchLabel}>{t('关闭消息右键菜单')}</div>
        </div>
        <Switch
          checked={settings['disableMessageContextMenu'] ?? false}
          onChange={(checked) =>
            setSettings({
              disableMessageContextMenu: checked,
            })
          }
        />
      </div>

      {pluginSettings
        .filter((item) => item.position === 'system')
        .map((item) => {
          return (
            <FullModalFactory
              key={item.name}
              value={_get(settings, item.name, item.defaultValue ?? false)}
              onChange={(val) => {
                setSettings({
                  [item.name]: val,
                });
              }}
              config={item}
            />
          );
        })}

      <div className={styles.switchRow}>
        <div>
          <div className={styles.switchLabel}>{t('Alpha测试开关')}</div>
          <div className={styles.switchDesc}>
            {t(
              '在 Alpha 模式下会有一些尚处于测试阶段的功能将会被开放，如果出现问题欢迎反馈'
            )}
          </div>
        </div>
        <Switch
          checked={isAlphaMode}
          onChange={(checked) => setAlphaMode(checked)}
        />
      </div>

      {isAlphaMode && (
        <div className={styles.switchRow}>
          <div>
            <div className={styles.switchLabel}>
              {t('聊天列表虚拟化') + ' (Beta)'}
            </div>
          </div>
          <Switch
            disabled={loading}
            loading={loading}
            checked={settings.messageListVirtualization ?? false}
            onChange={(checked) =>
              setSettings({
                messageListVirtualization: checked,
              })
            }
          />
        </div>
      )}

      <div style={{ marginTop: 24 }}>
        <Button
          type="primary"
          onClick={() => window.location.reload()}
        >
          {t('重新加载')}
        </Button>
      </div>
    </div>
  );
});
SettingsSystem.displayName = 'SettingsSystem';
