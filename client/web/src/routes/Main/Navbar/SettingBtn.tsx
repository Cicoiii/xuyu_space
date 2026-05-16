import { closeModal, openModal } from '@/components/Modal';
import { SettingsView } from '@/components/modals/SettingsView';
import { Icon } from 'tailchat-design';
import React, { useCallback } from 'react';
import styles from './Navbar.module.less';

export const SettingBtn: React.FC = React.memo(() => {
  const handleClick = useCallback(() => {
    const key = openModal(<SettingsView onClose={() => closeModal(key)} />);
  }, []);

  return (
    <div className={styles.iconBtn} onClick={handleClick}>
      <Icon icon="mdi:cog-outline" />
    </div>
  );
});
SettingBtn.displayName = 'SettingBtn';
