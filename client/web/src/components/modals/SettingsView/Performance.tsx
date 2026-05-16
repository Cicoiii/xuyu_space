import { measure } from '@/utils/measure-helper';
import React, { useMemo } from 'react';
import styles from '@/components/FullModal/FullModal.module.less';

export const SettingsPerformance: React.FC = React.memo(() => {
  const { vitals, record, timeUsage } = useMemo(
    () => ({
      vitals: measure.getVitals(),
      record: measure.getRecord(),
      timeUsage: measure.getTimeUsage(),
    }),
    []
  );

  return (
    <div>
      <div className={styles.perfBlock}>
        <div className={styles.perfTitle}>Vitals</div>
        <div className={styles.perfContent}>
          {Object.entries(vitals).map(([n, t]) => (
            <div key={n} className={styles.perfLine}>
              {n}: {t}ms
            </div>
          ))}
        </div>
      </div>

      <div className={styles.perfBlock}>
        <div className={styles.perfTitle}>Record</div>
        <div className={styles.perfContent}>
          {Object.entries(record).map(([n, t]) => (
            <div key={n} className={styles.perfLine}>
              {n}: {t}ms
            </div>
          ))}
        </div>
      </div>

      <div className={styles.perfBlock}>
        <div className={styles.perfTitle}>TimeUsage</div>
        <div className={styles.perfContent}>
          {Object.entries(timeUsage).map(([n, t]) => (
            <div key={n} className={styles.perfLine}>
              {n}: {t}ms
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
SettingsPerformance.displayName = 'SettingsPerformance';
