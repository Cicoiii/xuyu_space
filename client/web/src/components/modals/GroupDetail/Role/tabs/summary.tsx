import {
  DefaultFullModalInputEditorRender,
  FullModalField,
} from '@/components/FullModal/Field';
import { openReconfirmModal } from '@/components/Modal';
import React from 'react';
import { model, t, useMemoizedFn } from 'tailchat-shared';
import { Button } from 'antd';

interface RoleSummaryProps {
  currentRoleInfo: model.group.GroupRole;
  onChangeRoleName: (roleName: string) => void;
  onDeleteRole: () => Promise<void>;
}
// 权限概述
export const RoleSummary: React.FC<RoleSummaryProps> = React.memo((props) => {
  const { currentRoleInfo } = props;

  const handleDeleteRole = useMemoizedFn(() => {
    openReconfirmModal({
      title: t('确认要删除角色 {{name}} 么?', {
        name: currentRoleInfo.name,
      }),
      onConfirm: () => props.onDeleteRole(),
    });
  });

  return (
    <div style={{ padding: '0 8px' }}>
      <FullModalField
        title={t('身份组名称')}
        value={props.currentRoleInfo.name}
        editable={true}
        renderEditor={DefaultFullModalInputEditorRender}
        onSave={props.onChangeRoleName}
      />

      <Button danger onClick={handleDeleteRole}>
        {t('删除身份组')}
      </Button>
    </div>
  );
});
RoleSummary.displayName = 'RoleSummary';
