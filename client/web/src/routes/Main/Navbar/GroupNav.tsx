import { Avatar, Icon } from 'tailchat-design';
import { openModal } from '@/components/Modal';
import { ModalCreateGroup } from '@/components/modals/CreateGroup';
import React, { useMemo, useRef } from 'react';
import {
  GroupInfo,
  showSuccessToasts,
  t,
  useAppSelector,
  useEvent,
  useGlobalConfigStore,
  useGroupAck,
  useSingleUserSetting,
} from 'tailchat-shared';
import { NavbarNavItem } from './NavItem';
import { Dropdown, Tooltip } from 'antd';
import { useGroupUnreadState } from '@/hooks/useGroupUnreadState';
import { pluginCustomPanel } from '@/plugin/common';
import { NavbarCustomNavItem } from './CustomNavItem';
import SortableList, { SortableItem } from 'react-easy-sort';
import arrayMove from 'array-move';
import styles from './Navbar.module.less';

/**
 * 群组导航栏项
 */
const GroupNavItem: React.FC<{ group: GroupInfo }> = React.memo(({ group }) => {
  const groupId = group._id;
  const unreadState = useGroupUnreadState(groupId);
  const { markGroupAllAck } = useGroupAck(groupId);

  const menu = {
    items: [
      {
        key: 'ack',
        label: t('标记为已读'),
        icon: <Icon icon="mdi:message-badge-outline" />,
        onClick: () => {
          markGroupAllAck();
          showSuccessToasts(t('已标记该群组所有消息已读'));
        },
      },
    ],
  };

  const isMuted = unreadState === 'muted';

  return (
    <Dropdown menu={menu} trigger={['contextMenu']}>
      <div>
        <NavbarNavItem
          name={group.name}
          to={`/main/group/${group._id}`}
          showPill={true}
          badge={['muted', 'unread'].includes(unreadState)}
          badgeMuted={isMuted}
        >
          <Avatar
            className={styles.avatarShape}
            shape="square"
            size={36}
            name={group.name}
            src={group.avatar}
          />
        </NavbarNavItem>
      </div>
    </Dropdown>
  );
});
GroupNavItem.displayName = 'GroupNavItem';

function useGroupList() {
  const groups = useAppSelector((state) => state.group.groups);
  const { value: groupOrderList = [], setValue: setGroupOrderList } =
    useSingleUserSetting('groupOrderList', []);

  const handleSortEnd = useEvent((oldIndex: number, newIndex: number) => {
    setGroupOrderList(
      arrayMove(
        groupList.map((item) => item._id),
        oldIndex,
        newIndex
      )
    );
  });

  const groupList = useMemo(
    () =>
      Object.values(groups).sort((a, b) => {
        const aIndex = groupOrderList.findIndex((item) => item === a._id);
        const bIndex = groupOrderList.findIndex((item) => item === b._id);
        return aIndex - bIndex;
      }),
    [groups, groupOrderList]
  );
  return {
    handleSortEnd,
    groupList,
  };
}

export const GroupNav: React.FC = React.memo(() => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { groupList, handleSortEnd } = useGroupList();

  const handleCreateGroup = useEvent(() => {
    openModal(<ModalCreateGroup />);
  });

  const { disableCreateGroup } = useGlobalConfigStore((state) => ({
    disableCreateGroup: state.disableCreateGroup,
  }));

  return (
    <div data-tc-role="navbar-groups" ref={containerRef}>
      {pluginCustomPanel
        .filter((p) => p.position === 'navbar-group')
        .map((p) => (
          <NavbarCustomNavItem key={p.name} panelInfo={p} withBg={true} />
        ))}

      {Array.isArray(groupList) && (
        <SortableList
          lockAxis="y"
          onSortEnd={handleSortEnd}
          customHolderRef={containerRef}
        >
          {groupList.map((group) => (
            <SortableItem key={group._id}>
              <div className="overflow-hidden">
                <GroupNavItem group={group} />
              </div>
            </SortableItem>
          ))}
        </SortableList>
      )}

      {!disableCreateGroup && (
        <div className={styles.navItemWrapper}>
          <Tooltip
            title={<div className="font-medium px-1 py-0.5">{t('创建群组')}</div>}
            placement="right"
            overlayClassName="navbar-tooltip"
          >
            <div
              className={styles.createGroupBtn}
              onClick={handleCreateGroup}
              data-testid="create-group"
            >
              <Icon icon="mdi:plus" />
            </div>
          </Tooltip>
        </div>
      )}
    </div>
  );
});
GroupNav.displayName = 'GroupNav';
