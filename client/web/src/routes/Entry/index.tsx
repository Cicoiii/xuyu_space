import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginView } from './LoginView';
import styles from './index.module.less';
import loginBgUrl from '@assets/images/bg_xuyu.jpg';
import { RegisterView } from './RegisterView';
import { useRecordMeasure } from '@/utils/measure-helper';
import { GuestView } from './GuestView';
import { ForgetPasswordView } from './ForgetPasswordView';

const EntryRoute = React.memo(() => {
  useRecordMeasure('appEntryRenderStart');

  return (
    <div className={styles.entryContainer}>
      {/* 左侧：表单区域 */}
      <div className={styles.entryLeft}>
        <Routes>
          <Route path="/login" element={<LoginView />} />
          <Route path="/register" element={<RegisterView />} />
          <Route path="/guest" element={<GuestView />} />
          <Route path="/forget" element={<ForgetPasswordView />} />
          <Route
            path="/"
            element={<Navigate to="/entry/login" replace={true} />}
          />
        </Routes>
      </div>

      {/* 右侧：背景图区域 */}
      <div
        className={styles.entryRight}
        style={{ backgroundImage: `url(${loginBgUrl})` }}
      />
    </div>
  );
});
EntryRoute.displayName = 'EntryRoute';

export default EntryRoute;
