/**
 * 插件商店
 */

import { Icon } from 'tailchat-design';
import React, { useState } from 'react';
import { t, useAsync } from 'tailchat-shared';
import { builtinPlugins } from '../builtin';
import { pluginManager } from '../manager';
import { PluginStoreItem } from './Item';
import _uniqBy from 'lodash/uniqBy';
import styles from './PluginStore.module.less';

function usePluginStoreData() {
  const { loading: loading1, value: installedPluginList = [] } = useAsync(
    async () => pluginManager.getInstalledPlugins(),
    []
  );
  const { loading: loading2, value: allPlugins = [] } = useAsync(
    async () => pluginManager.getRegistryPlugins(),
    []
  );

  const loading = loading1 || loading2;

  return {
    loading,
    installedPluginList,
    allPlugins,
  };
}

export const PluginStore: React.FC = React.memo(() => {
  const { loading, installedPluginList, allPlugins } = usePluginStoreData();
  const [activeTab, setActiveTab] = useState<'installed' | 'all'>('all');

  if (loading) {
    return (
      <div className={styles.storeContainer}>
        <div className={styles.storeHeader}>
          <div className={styles.storeTitle}>{t('插件中心')}</div>
        </div>
        <div className={styles.loadingState}>
          <Icon className="animate-spin" icon="mdi:loading" style={{ fontSize: 24, marginRight: 8 }} />
          {t('正在加载插件列表')}
        </div>
      </div>
    );
  }

  const installedPluginNameList = installedPluginList.map((p) => p.name);
  const builtinPluginNameList = builtinPlugins.map((p) => p.name);

  return (
    <div className={styles.storeContainer}>
      <div className={styles.storeHeader}>
        <div className={styles.storeTitle}>{t('插件中心')}</div>
      </div>

      <div className={styles.tabs}>
        <div
          className={`${styles.tab} ${activeTab === 'installed' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('installed')}
        >
          {t('已安装')}
        </div>
        <div
          className={`${styles.tab} ${activeTab === 'all' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('all')}
        >
          {t('全部')}
        </div>
      </div>

      <div className={styles.storeContent}>
        {activeTab === 'installed' && (
          <>
            {_uniqBy(
              [...builtinPlugins, ...installedPluginList],
              'name'
            ).length === 0 ? (
              <div className={styles.emptyState}>
                <Icon className={styles.emptyIcon} icon="mdi:puzzle-outline" />
                <div className={styles.emptyText}>{t('暂无已安装的插件')}</div>
              </div>
            ) : (
              <div className={styles.pluginGrid}>
                {_uniqBy(
                  [...builtinPlugins, ...installedPluginList],
                  'name'
                ).map((plugin, index) => (
                  <PluginStoreItem
                    key={plugin.name}
                    manifest={plugin}
                    installed={true}
                    builtin={builtinPluginNameList.includes(plugin.name)}
                    style={{ animationDelay: `${index * 30}ms` }}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'all' && (
          <>
            <div className={styles.sectionTitle}>{t('内置插件')}</div>
            <div className={styles.pluginGrid}>
              {builtinPlugins.map((plugin, index) => (
                <PluginStoreItem
                  key={plugin.name}
                  manifest={plugin}
                  installed={installedPluginNameList.includes(plugin.name)}
                  builtin={true}
                  style={{ animationDelay: `${index * 30}ms` }}
                />
              ))}
            </div>

            <div className={styles.sectionTitle}>{t('插件中心')}</div>
            <div className={styles.pluginGrid}>
              {_uniqBy(
                allPlugins.filter((p) => !builtinPluginNameList.includes(p.name)),
                'name'
              ).map((plugin, index) => (
                  <PluginStoreItem
                    key={plugin.name}
                    manifest={plugin}
                    installed={installedPluginNameList.includes(plugin.name)}
                    style={{ animationDelay: `${(index + builtinPlugins.length) * 30}ms` }}
                  />
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
});
PluginStore.displayName = 'PluginStore';
