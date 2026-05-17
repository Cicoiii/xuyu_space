import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import _isFunction from 'lodash/isFunction';
import { Icon } from 'tailchat-design';
import clsx from 'clsx';
import styles from './FullModal.module.less';

/**
 * 全屏模态框
 */
interface FullModalProps extends PropsWithChildren {
  visible?: boolean;
  onChangeVisible?: (visible: boolean) => void;
}
export const FullModal: React.FC<FullModalProps> = React.memo((props) => {
  const { visible = true, onChangeVisible } = props;
  const ref = useRef<HTMLDivElement | null>(null);

  const handleClose = useCallback(() => {
    _isFunction(onChangeVisible) && onChangeVisible(false);
  }, [onChangeVisible]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keyup', handler);

    return () => {
      window.removeEventListener('keyup', handler);
    };
  }, [handleClose]);

  return (
    <div
      className={clsx(
        'fixed left-0 right-0 top-0 bottom-0 z-50 flex justify-center items-center',
        {
          'opacity-0': !visible,
        }
      )}
      style={{
        backgroundColor: 'var(--tc-surface-color)',
        color: 'var(--tc-text-color)',
      }}
      ref={ref}
    >
      {props.children}

      {_isFunction(onChangeVisible) && (
        <div className={styles.closeBtn} onClick={handleClose} data-testid="full-modal-close">
          <Icon className={styles.closeIcon} icon="mdi:close" />
          <span className={styles.closeLabel}>ESC</span>
        </div>
      )}
    </div>
  );
});
FullModal.displayName = 'FullModal';
