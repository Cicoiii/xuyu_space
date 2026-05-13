import React from 'react';
import {
  groupActions,
  model,
  showSuccessToasts,
  t,
  UploadFileResult,
  useAppDispatch,
  useAsyncRequest,
  useGroupInfo,
} from 'tailchat-shared';
import { Image } from 'tailchat-design';
import { Loading } from '@/components/Loading';
import { FullModalField } from '@/components/FullModal/Field';
import { FullModalCommonTitle } from '@/components/FullModal/CommonTitle';
import { Switch, Button } from 'antd';
import { pluginGroupConfigItems } from '@/plugin/common';
import { ensurePluginNamePrefix } from '@/utils/plugin-helper';
import { ImageUploader } from '@/components/ImageUploader';
import styles from '@/components/FullModal/FullModal.module.less';

export const GroupConfig: React.FC<{
  groupId: string;
}> = React.memo((props) => {
  const groupId = props.groupId;
  const groupInfo = useGroupInfo(groupId);
  const dispatch = useAppDispatch();

  const [{ loading }, handleModifyConfig] = useAsyncRequest(
    async (configName: model.group.GroupConfigNames, configValue: any) => {
      await model.group.modifyGroupConfig(groupId, configName, configValue);
      dispatch(
        groupActions.updateGroupConfig({
          groupId,
          configName,
          configValue,
        })
      );
      showSuccessToasts();
    },
    [groupId]
  );

  if (!groupInfo) {
    return <Loading spinning={true} />;
  }

  const config = groupInfo.config ?? {};

  return (
    <div>
      <FullModalCommonTitle>{t('群组配置')}</FullModalCommonTitle>

      <div className={styles.switchRow}>
        <div>
          <div className={styles.switchLabel}>{t('隐藏成员完整名称')}</div>
          <div className={styles.switchDesc}>
            {t('群组隐私控制，防止通过群组恶意获取成员信息')}
          </div>
        </div>
        <Switch
          disabled={loading}
          checked={config['hideGroupMemberDiscriminator'] ?? false}
          onChange={(checked) =>
            handleModifyConfig('hideGroupMemberDiscriminator', checked)
          }
        />
      </div>

      <div className={styles.switchRow}>
        <div>
          <div className={styles.switchLabel}>{t('禁止在群组发起私信')}</div>
          <div className={styles.switchDesc}>
            {t('群组隐私控制，防止通过群组恶意骚扰用户。')}
          </div>
        </div>
        <Switch
          disabled={
            loading || config['hideGroupMemberDiscriminator'] === true
          }
          checked={
            (config['hideGroupMemberDiscriminator'] === true ||
              config['disableCreateConverseFromGroup']) ??
            false
          }
          onChange={(checked) =>
            handleModifyConfig('disableCreateConverseFromGroup', checked)
          }
        />
      </div>

      <FullModalField
        title={t('群组背景')}
        tip={t('个性化配置群组背景，将会在群组邀请页面展示')}
        content={
          <>
            <ImageUploader
              aspect={16 / 9}
              usage="group"
              onUploadSuccess={(fileInfo: UploadFileResult) => {
                handleModifyConfig('groupBackgroundImage', fileInfo.url);
              }}
            >
              <Image
                wrapperClassName="block"
                style={{ width: 480, height: 270, maxWidth: '100%' }}
                src={config['groupBackgroundImage']}
              />
            </ImageUploader>
            <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>
              {t('建议比例: 16:9 | 建议大小: 1280x720')}
            </div>

            {config['groupBackgroundImage'] && (
              <Button
                style={{ marginTop: 8 }}
                onClick={() => {
                  handleModifyConfig('groupBackgroundImage', '');
                }}
              >
                {t('清除')}
              </Button>
            )}
          </>
        }
      />

      {pluginGroupConfigItems.map((item) => {
        const name = ensurePluginNamePrefix(item.name);
        return (
          <FullModalField
            key={name}
            title={item.title}
            tip={item.tip}
            content={React.createElement(item.component, {
              value: config[name],
              onChange: (val: any) => handleModifyConfig(name, val),
              loading,
            })}
          />
        );
      })}
    </div>
  );
});
GroupConfig.displayName = 'GroupConfig';
