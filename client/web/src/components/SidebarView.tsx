import React, { useState, useContext } from 'react';
import _get from 'lodash/get';
import { DevContainer } from 'tailchat-shared';
import clsx from 'clsx';
import styles from './FullModal/FullModal.module.less';

export interface SidebarViewMenuItemType {
  type: 'item';
  title: string;
  content: React.ReactNode;

  /**
   * 是否是仅开发者可见
   */
  isDev?: boolean;

  /**
   * 隐藏这个项
   */
  hidden?: boolean;
}

interface SidebarViewLinkType {
  type: 'link';
  title: string;
  onClick: () => void;
  isDanger?: boolean;
}

interface SidebarViewContextProps {
  content: React.ReactNode;
  setContent: (content: React.ReactNode) => void;
}
export const SidebarViewContext =
  React.createContext<SidebarViewContextProps | null>(null);
SidebarViewContext.displayName = 'SidebarViewContext';

export type SidebarViewMenuItem = SidebarViewMenuItemType | SidebarViewLinkType;
export type SidebarViewMenuType =
  | {
      type: 'group';
      title: string;
      children: SidebarViewMenuItem[];
    }
  | SidebarViewMenuItem;

interface SidebarViewMenuProps {
  menu: SidebarViewMenuType;
}

const SidebarViewMenuItem: React.FC<SidebarViewMenuProps> = React.memo(
  (props) => {
    const { menu } = props;
    const context = useContext(SidebarViewContext);

    if (!context) {
      return null;
    }

    const { content, setContent } = context;

    if (menu.type === 'group') {
      return (
        <div className={styles.sidebarGroup}>
          <div className={styles.sidebarGroupTitle}>{menu.title}</div>
          <div>
            {menu.children.map((sub, i) => (
              <SidebarViewMenuItem key={i} menu={sub} />
            ))}
          </div>
        </div>
      );
    } else if (menu.type === 'item') {
      if (menu.hidden === true) {
        return null;
      }

      const isActive = content === menu.content;

      const component = (
        <div
          className={clsx(styles.sidebarItem, {
            [styles.sidebarItemActive]: isActive,
          })}
          onClick={() => setContent(menu.content)}
        >
          {menu.title}
        </div>
      );

      if (menu.isDev === true) {
        return <DevContainer>{component}</DevContainer>;
      } else {
        return component;
      }
    } else if (menu.type === 'link') {
      return (
        <div
          className={clsx(styles.sidebarItem, {
            [styles.sidebarItemDanger]: menu.isDanger,
          })}
          onClick={menu.onClick}
        >
          {menu.title}
        </div>
      );
    }

    return null;
  }
);
SidebarViewMenuItem.displayName = 'SidebarViewMenuItem';

interface SidebarViewProps {
  menu: SidebarViewMenuType[];

  /**
   * 默认内容路径
   * @default "0.children.0.content"
   */
  defaultContentPath: string;

  /**
   * 是否使用宽屏内容区
   */
  wide?: boolean;
}
export const SidebarView: React.FC<SidebarViewProps> = React.memo((props) => {
  const { menu, defaultContentPath = '0.children.0.content', wide } = props;
  const [content, setContent] = useState<React.ReactNode>(
    _get(menu, defaultContentPath, null)
  );

  return (
    <SidebarViewContext.Provider value={{ content, setContent }}>
      <div className="flex w-full h-full mobile:flex-col mobile:overflow-auto">
        <div className={styles.sidebar}>
          {menu.map((item, i) => (
            <SidebarViewMenuItem key={i} menu={item} />
          ))}
        </div>

        <div className={styles.content}>
          <div className={wide ? styles.contentInnerWide : styles.contentInner}>{content}</div>
        </div>
      </div>
    </SidebarViewContext.Provider>
  );
});
SidebarView.displayName = 'SidebarView';
