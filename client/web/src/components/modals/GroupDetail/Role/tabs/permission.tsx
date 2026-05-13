import { ALL_PERMISSION, getDefaultPermissionList } from 'tailchat-shared';
import React, { useCallback, useMemo } from 'react';
import { model, t } from 'tailchat-shared';
import { useModifyPermission } from '../useModifyPermission';
import { PermissionList } from '@/components/PermissionList';
import { Button } from 'antd';

interface RolePermissionProps {
  roleId: typeof ALL_PERMISSION | string;
  currentRoleInfo?: model.group.GroupRole;
  fallbackPermissions: string[];
  onSavePermission: (permissions: string[]) => Promise<void>;
}
export const RolePermission: React.FC<RolePermissionProps> = React.memo(
  (props) => {
    const currentRolePermissions: string[] = useMemo(() => {
      if (props.roleId === ALL_PERMISSION) {
        return props.fallbackPermissions;
      }

      return props.currentRoleInfo?.permissions ?? [];
    }, [props.roleId, props.fallbackPermissions, props.currentRoleInfo]);

    const { isEditing, editingPermission, setEditingPermission } =
      useModifyPermission(currentRolePermissions);

    const handleResetPermission = useCallback(() => {
      setEditingPermission(getDefaultPermissionList());
    }, []);

    // 权限概述
    return (
      <div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginBottom: 8 }}>
          <Button onClick={handleResetPermission}>
            {t('重置为默认值')}
          </Button>
          <Button
            type="primary"
            style={{ opacity: !isEditing ? 0.5 : 1 }}
            disabled={!isEditing}
            onClick={() => props.onSavePermission(editingPermission)}
          >
            {t('保存')}
          </Button>
        </div>

        <PermissionList
          value={editingPermission}
          onChange={setEditingPermission}
        />
      </div>
    );
  }
);
RolePermission.displayName = 'RolePermission';
