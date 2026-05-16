import React, { useCallback, useRef, useState } from 'react';
import {
  createGroup,
  GroupPanelType,
  t,
  useAppDispatch,
  useAsyncRequest,
  groupActions,
} from 'tailchat-shared';
import type { GroupPanel } from 'tailchat-shared';
import { closeModal, ModalWrapper } from '../Modal';
import { Slides, SlidesRef } from '../Slides';
import { useNavigate } from 'react-router';
import { applyDefaultFallbackGroupPermission } from 'tailchat-shared';
import { Avatar, Icon } from 'tailchat-design';
import styles from '../Modals.module.less';

const panelTemplate: {
  key: string;
  label: string;
  desc: string;
  icon: string;
  iconClass: string;
  panels: GroupPanel[];
}[] = [
  {
    key: 'default',
    label: t('默认群组'),
    desc: t('文字频道 + 大厅'),
    icon: 'mdi:chat-outline',
    iconClass: styles.templateIconDefault,
    panels: [
      {
        id: '00',
        name: t('文字频道'),
        type: GroupPanelType.GROUP,
      },
      {
        id: '01',
        name: t('大厅'),
        parentId: '00',
        type: GroupPanelType.TEXT,
      },
    ],
  },
  {
    key: 'work',
    label: t('工作协同'),
    desc: t('公共 + 会议室'),
    icon: 'mdi:briefcase-outline',
    iconClass: styles.templateIconWork,
    panels: [
      {
        id: '00',
        name: t('公共'),
        type: GroupPanelType.GROUP,
      },
      {
        id: '01',
        name: t('全员'),
        parentId: '00',
        type: GroupPanelType.TEXT,
      },
      {
        id: '10',
        name: t('临时会议'),
        type: GroupPanelType.GROUP,
      },
      {
        id: '11',
        name: t('会议室') + '1',
        parentId: '10',
        type: GroupPanelType.TEXT,
      },
      {
        id: '11',
        name: t('会议室') + '2',
        parentId: '10',
        type: GroupPanelType.TEXT,
      },
    ],
  },
];

export const ModalCreateGroup: React.FC = React.memo(() => {
  const slidesRef = useRef<SlidesRef>(null);
  const [panels, setPanels] = useState<GroupPanel[]>([]);
  const [name, setName] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSelectTemplate = useCallback((panels: GroupPanel[]) => {
    setPanels(panels);
    slidesRef.current?.next();
  }, []);

  const handleBack = useCallback(() => {
    slidesRef.current?.prev();
  }, []);

  const [{ loading }, handleCreate] = useAsyncRequest(async () => {
    const data = await createGroup(name, panels);

    dispatch(groupActions.appendGroups([data]));

    navigate(`/main/group/${data._id}`);

    await applyDefaultFallbackGroupPermission(String(data._id));

    closeModal();
  }, [name, panels, location]);

  return (
    <ModalWrapper style={{ maxWidth: 440 }}>
      <div className={styles.createGroupContainer}>
        <Slides ref={slidesRef}>
          {/* 第一步：选择模板 */}
          <div>
            <div className={styles.stepTitle}>{t('创建群组')}</div>
            <div className={styles.stepSubtitle}>
              {t('选择以下模板, 开始创建属于自己的群组吧!')}
            </div>

            <div className={styles.templateList}>
              {panelTemplate.map((template) => (
                <div
                  key={template.key}
                  className={styles.templateCard}
                  onClick={() => handleSelectTemplate(template.panels)}
                >
                  <div
                    className={`${styles.templateIcon} ${template.iconClass}`}
                  >
                    <Icon icon={template.icon} />
                  </div>
                  <div className={styles.templateInfo}>
                    <div className={styles.templateName}>
                      {template.label}
                    </div>
                    <div className={styles.templateDesc}>
                      {template.desc}
                    </div>
                  </div>
                  <Icon
                    className={styles.templateArrow}
                    icon="mdi:chevron-right"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 第二步：自定义 */}
          <div>
            <div className={styles.stepTitle}>{t('自定义你的群组')}</div>
            <div className={styles.stepSubtitle}>
              {t('不要担心, 在此之后你可以随时进行变更')}
            </div>

            <div className={styles.avatarPreview}>
              <Avatar size={72} name={name} shape="square" />
            </div>

            <div>
              <div className={styles.nameLabel}>{t('群组名称')}</div>
              <input
                className={styles.nameInput}
                maxLength={100}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('输入群组名称')}
              />
            </div>

            <div className={styles.stepFooter}>
              <button className={styles.btnBack} onClick={handleBack}>
                {t('返回')}
              </button>
              <button
                className={styles.btnCreate}
                disabled={loading || !name.trim()}
                onClick={handleCreate}
              >
                {loading && <Icon icon="mdi:loading" className="animate-spin" />}
                {t('确认创建')}
              </button>
            </div>
          </div>
        </Slides>
      </div>
    </ModalWrapper>
  );
});
ModalCreateGroup.displayName = 'ModalCreateGroup';
