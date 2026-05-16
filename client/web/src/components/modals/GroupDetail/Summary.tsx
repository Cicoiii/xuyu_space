import { AvatarUploader } from '@/components/ImageUploader';
import { FullModalCommonTitle } from '@/components/FullModal/CommonTitle';
import {
  DefaultFullModalInputEditorRender,
  FullModalField,
  FullModalFieldEditorRenderComponent,
} from '@/components/FullModal/Field';
import { NoData } from '@/components/NoData';
import { Input } from 'antd';
import React from 'react';
import { Avatar } from 'tailchat-design';
import {
  modifyGroupField,
  PERMISSION,
  showSuccessToasts,
  showToasts,
  t,
  UploadFileResult,
  useAsyncRequest,
  useGroupInfo,
  useHasGroupPermission,
} from 'tailchat-shared';
import styles from '@/components/FullModal/FullModal.module.less';

export const GroupSummary: React.FC<{
  groupId: string;
}> = React.memo(({ groupId }) => {
  const groupInfo = useGroupInfo(groupId);
  const [hasBaseInfoPermission] = useHasGroupPermission(groupId, [
    PERMISSION.core.groupBaseInfo,
  ]);

  const [, handleUpdateGroupName] = useAsyncRequest(
    async (newName: string) => {
      await modifyGroupField(groupId, 'name', newName);
      showSuccessToasts(t('修改群组名成功'));
    },
    [groupId]
  );

  const [, handleUpdateGroupDescription] = useAsyncRequest(
    async (newName: string) => {
      await modifyGroupField(groupId, 'description', newName);
      showSuccessToasts(t('修改群组描述成功'));
    },
    [groupId]
  );

  const [, handleGroupAvatarChange] = useAsyncRequest(
    async (fileInfo: UploadFileResult) => {
      await modifyGroupField(groupId, 'avatar', fileInfo.url);
      showToasts(t('修改群组头像成功'), 'success');
    },
    [groupId]
  );

  if (!groupInfo) {
    return <NoData message={t('无法获取到群组信息')} />;
  }

  return (
    <div>
      <FullModalCommonTitle>{t('群组概述')}</FullModalCommonTitle>

      <div className={styles.avatarSection}>
        <div className={styles.avatarCol}>
          <AvatarUploader
            circle={true}
            usage="group"
            onUploadSuccess={handleGroupAvatarChange}
          >
            <Avatar size={64} name={groupInfo.name} src={groupInfo.avatar} />
          </AvatarUploader>
        </div>

        <div className={styles.avatarFields}>
          <FullModalField
            title={t('群组名称')}
            value={groupInfo.name}
            editable={hasBaseInfoPermission}
            renderEditor={DefaultFullModalInputEditorRender}
            onSave={handleUpdateGroupName}
          />

          <FullModalField
            title={t('成员数')}
            value={String(groupInfo.members.length)}
          />

          <FullModalField
            title={t('群组描述')}
            value={groupInfo.description ?? ''}
            content={<pre style={{ margin: 0, fontFamily: 'inherit' }}>{groupInfo.description ?? ''}</pre>}
            editable={hasBaseInfoPermission}
            renderEditor={GroupDescriptionEditorRender}
            onSave={handleUpdateGroupDescription}
          />
        </div>
      </div>
    </div>
  );
});
GroupSummary.displayName = 'GroupSummary';

const GroupDescriptionEditorRender: FullModalFieldEditorRenderComponent = ({
  value,
  onChange,
}) => (
  <Input.TextArea
    autoSize={{ minRows: 4, maxRows: 6 }}
    maxLength={120}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    showCount={true}
  />
);
