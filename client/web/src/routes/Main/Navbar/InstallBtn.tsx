import { canInstallprompt, showInstallPrompt } from '@/utils/sw-helper';
import React, { useEffect, useState } from 'react';
import { Icon } from 'tailchat-design';
import styles from './Navbar.module.less';

/**
 * 安装按钮
 */
export const InstallBtn: React.FC = React.memo(() => {
  const canInstall = useCanInstallPwa();

  if (!canInstall) {
    return null;
  }

  return (
    <div className={styles.iconBtn} onClick={showInstallPrompt}>
      <Icon icon="mdi:download-outline" />
    </div>
  );
});
InstallBtn.displayName = 'InstallBtn';

function useCanInstallPwa() {
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    if (canInstallprompt()) {
      setCanInstall(true);
      return;
    }

    const handleEvent = (e: any) => {
      setCanInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleEvent);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleEvent);
    };
  }, []);

  return canInstall;
}
