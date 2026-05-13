import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  useGroupInfo,
  GroupPanel as GroupPanelInfo,
  t,
  modifyGroupField,
  useAsyncRequest,
  showToasts,
} from 'tailchat-shared';
import _isEqual from 'lodash/isEqual';
import { GroupPanelTree } from './GroupPanelTree';
import { FullModalCommonTitle } from '@/components/FullModal/CommonTitle';
import { closeModal, openModal } from '@/components/Modal';
import { ModalCreateGroupPanel } from '../../GroupPanel/CreateGroupPanel';
import styles from '@/components/FullModal/FullModal.module.less';
import { Button } from 'antd';

export const GroupPanel: React.FC<{
  groupId: string;
}> = React.memo((props) => {
  const groupId = props.groupId;
  const groupInfo = useGroupInfo(groupId);
  const groupPanels = groupInfo?.panels ?? [];
  const [editingGroupPanels, setEditingGroupPanels] = useState(groupPanels);
  const isEditingRef = useRef(false);

  useEffect(() => {
    if (isEditingRef.current === true) {
      return;
    }

    setEditingGroupPanels(groupPanels);
  }, [groupPanels]);

  const handleChange = useCallback((newGroupPanels: GroupPanelInfo[]) => {
    isEditingRef.current = true;
    setEditingGroupPanels(newGroupPanels);
  }, []);

  const [{ loading }, handleSave] = useAsyncRequest(async () => {
    await modifyGroupField(groupId, 'panels', editingGroupPanels);
    isEditingRef.current = false;
    showToasts(t('保存成功'), 'success');
  }, [editingGroupPanels]);

  const handleReset = useCallback(() => {
    setEditingGroupPanels(groupPanels);
    isEditingRef.current = false;
  }, [groupPanels]);

  const handleOpenCreatePanelModal = useCallback(() => {
    const key = openModal(
      <ModalCreateGroupPanel
        groupId={groupId}
        onSuccess={() => {
          closeModal(key);
          isEditingRef.current = false;
        }}
      />
    );
  }, []);

  return (
    <div>
      <FullModalCommonTitle
        extra={
          <Button type="primary" onClick={handleOpenCreatePanelModal}>
            {t('创建面板')}
          </Button>
        }
      >
        {t('面板管理')}
      </FullModalCommonTitle>

      <div className={styles.panelTreeContainer}>
        <GroupPanelTree
          groupId={groupId}
          groupPanels={editingGroupPanels}
          onChange={handleChange}
        />
      </div>

      {!_isEqual(groupPanels, editingGroupPanels) && (
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <Button type="primary" onClick={handleSave} style={{ opacity: loading ? 0.6 : 1 }}>
            {loading ? t('保存中...') : t('保存')}
          </Button>
          <Button onClick={handleReset}>
            {t('重置')}
          </Button>
        </div>
      )}
    </div>
  );
});
GroupPanel.displayName = 'GroupPanel';
