import { Avatar, Icon } from 'tailchat-design';
import React, { useCallback, useState } from 'react';
import {
  isValidStr,
  parseUrlStr,
  PluginManifest,
  showAlert,
  showToasts,
  t,
  useAsyncRequest,
} from 'tailchat-shared';
import { ModalWrapper, openModal } from '../common';
import { pluginManager } from '../manager';
import { DocumentView } from './DocumentView';
import { getManifestFieldWithI18N } from '../utils';
import styles from './PluginStore.module.less';

/**
 * 插件项
 */
export const PluginStoreItem: React.FC<{
  manifest: PluginManifest;
  installed: boolean;
  builtin?: boolean;
  style?: React.CSSProperties;
}> = React.memo((props) => {
  const { manifest, builtin = false } = props;
  const [installed, setInstalled] = useState(props.installed);

  const [{ loading }, handleInstallPlugin] = useAsyncRequest(async () => {
    await pluginManager.installPlugin(manifest);
    if (manifest.requireRestart === true) {
      showToasts(t('插件安装成功, 刷新页面后生效'), 'success');
    } else {
      showToasts(t('插件安装成功'), 'success');
    }
    setInstalled(true);
  }, [manifest]);

  const handleUninstallPlugin = useCallback(() => {
    showAlert({
      message: t('是否要卸载插件'),
      onConfirm: async () => {
        await pluginManager.uninstallPlugin(manifest.name);
        showToasts(t('插件卸载成功, 刷新页面后生效'), 'success');
      },
    });
  }, [manifest]);

  const handleShowDocument = useCallback(() => {
    if (!isValidStr(manifest.documentUrl)) {
      return;
    }

    openModal(
      <ModalWrapper title={label}>
        <DocumentView documentUrl={parseUrlStr(manifest.documentUrl)} />
      </ModalWrapper>
    );
  }, [manifest]);

  const label = getManifestFieldWithI18N(manifest, 'label');
  const description = getManifestFieldWithI18N(manifest, 'description');

  return (
    <div className={styles.pluginCard} style={props.style}>
      <div className={styles.pluginIcon}>
        <Avatar shape="square" size={40} src={manifest.icon} name={label} />
      </div>

      <div className={styles.pluginInfo}>
        <div className={styles.pluginName}>{label}</div>
        <div className={styles.pluginId}>{manifest.name}</div>
        <div className={styles.pluginDesc}>{description}</div>

        <div className={styles.pluginActions}>
          {isValidStr(manifest.documentUrl) && (
            <button
              className={`${styles.actionBtn} ${styles.docBtn}`}
              onClick={handleShowDocument}
            >
              <Icon icon="mdi:file-document-outline" style={{ fontSize: 14 }} />
              {t('文档')}
            </button>
          )}

          {builtin ? (
            <span className={`${styles.actionBtn} ${styles.builtinBtn}`}>
              {t('内置插件')}
            </span>
          ) : installed ? (
            <button
              className={`${styles.actionBtn} ${styles.installedBtn}`}
              onClick={handleUninstallPlugin}
            >
              {t('已安装')}
            </button>
          ) : (
            <button
              className={`${styles.actionBtn} ${styles.installBtn} ${loading ? styles.loading : ''}`}
              onClick={handleInstallPlugin}
              disabled={loading}
            >
              {loading ? (
                <Icon className="animate-spin" icon="mdi:loading" style={{ fontSize: 14 }} />
              ) : (
                <Icon icon="mdi:download" style={{ fontSize: 14 }} />
              )}
              {t('安装')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
});
PluginStoreItem.displayName = 'PluginStoreItem';
