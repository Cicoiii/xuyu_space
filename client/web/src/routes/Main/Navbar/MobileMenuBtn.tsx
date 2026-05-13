import { useIsMobile } from '@/hooks/useIsMobile';
import { Icon } from 'tailchat-design';
import React, { useCallback } from 'react';
import { useSidebarContext } from '../SidebarContext';
import styles from './Navbar.module.less';

export const MobileMenuBtn: React.FC = React.memo(() => {
  const { showSidebar, setShowSidebar } = useSidebarContext();
  const isMobile = useIsMobile();

  const handleSwitchSidebar = useCallback(() => {
    setShowSidebar(!showSidebar);
  }, [showSidebar]);

  if (!isMobile) {
    return null;
  }

  return (
    <div className={styles.iconBtn} onClick={handleSwitchSidebar}>
      <Icon icon={showSidebar ? 'mdi:menu-open' : 'mdi:menu'} />
    </div>
  );
});
MobileMenuBtn.displayName = 'MobileMenuBtn';
