import { stopPropagation } from '@/utils/dom-helper';
import React, { useCallback, useState } from 'react';
import { t } from 'tailchat-shared';
import { PortalAdd, PortalRemove } from '../Portal';
import { useGlobalKeyDown } from '@/hooks/useGlobalKeyDown';
import {
  isArrowDown,
  isArrowUp,
  isEnterHotkey,
  isEscHotkey,
} from '@/utils/hot-key';
import { useQuickSwitcherActionContext } from './useQuickSwitcherActionContext';
import { useQuickSwitcherFilteredActions } from './useQuickSwitcherFilteredActions';
import { Icon } from 'tailchat-design';
import clsx from 'clsx';
import styles from '../Modals.module.less';

let currentQuickSwitcherKey: number | null = null;

const QuickSwitcher: React.FC = React.memo(() => {
  const [keyword, setKeyword] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const actionContext = useQuickSwitcherActionContext();

  const handleClose = useCallback(() => {
    if (!currentQuickSwitcherKey) {
      return;
    }

    PortalRemove(currentQuickSwitcherKey);
    currentQuickSwitcherKey = null;
  }, []);

  const filteredActions = useQuickSwitcherFilteredActions(keyword);

  useGlobalKeyDown((e) => {
    if (isArrowUp(e)) {
      e.preventDefault();
      const newIndex = selectedIndex - 1;
      setSelectedIndex(
        newIndex >= 0 ? newIndex : filteredActions.length + newIndex
      );
    } else if (isArrowDown(e)) {
      e.preventDefault();
      setSelectedIndex((selectedIndex + 1) % filteredActions.length);
    }

    if (isEnterHotkey(e)) {
      const selectedAction = filteredActions[selectedIndex];
      typeof selectedAction.action === 'function' &&
        selectedAction.action(actionContext);
      handleClose();
    } else if (isEscHotkey(e)) {
      handleClose();
    }
  });

  return (
    <div className={styles.quickSwitcherOverlay} onClick={handleClose}>
      <div
        className={styles.quickSwitcherPanel}
        onClick={stopPropagation}
      >
        {/* 搜索栏 */}
        <div className={styles.quickSearchHeader}>
          <Icon className={styles.quickSearchIcon} icon="mdi:magnify" />
          <input
            className={styles.quickSearchInput}
            autoFocus={true}
            placeholder={t('快速搜索、跳转')}
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setSelectedIndex(0);
            }}
          />
          <span className={styles.quickSearchKbd}>ESC</span>
        </div>

        {/* 结果列表 */}
        <div className={styles.quickSearchResults}>
          {filteredActions.length === 0 ? (
            <div className={styles.quickSearchEmpty}>
              <Icon
                className={styles.quickSearchEmptyIcon}
                icon="mdi:magnify-close"
              />
              <span>{t('没有找到匹配的结果')}</span>
            </div>
          ) : (
            filteredActions.map((action, i) => (
              <div
                key={action.key}
                className={clsx(
                  styles.quickSearchItem,
                  selectedIndex === i && styles.quickSearchItemActive
                )}
                onClick={() => {
                  action.action(actionContext);
                  handleClose();
                }}
                onMouseEnter={() => setSelectedIndex(i)}
              >
                <div className={styles.quickSearchItemIcon}>
                  <Icon icon="mdi:arrow-top-right" />
                </div>
                <div className={styles.quickSearchItemContent}>
                  <div className={styles.quickSearchItemLabel}>
                    {action.label}
                  </div>
                  <div className={styles.quickSearchItemSource}>
                    {action.source}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
});
QuickSwitcher.displayName = 'QuickSwitcher';

/**
 * 打开快速开关
 */
export function openQuickSwitcher() {
  if (typeof currentQuickSwitcherKey === 'number') {
    return;
  }

  currentQuickSwitcherKey = PortalAdd(<QuickSwitcher />);
}
