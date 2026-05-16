import { Icon } from 'tailchat-design';
import {
  isValidStr,
  loginWithEmail,
  t,
  useAsyncFn,
  useGlobalConfigStore,
} from 'tailchat-shared';
import React, { useEffect, useState } from 'react';
import { string } from 'yup';
import { useLocation, useNavigate } from 'react-router';
import { setUserJWT } from '../../utils/jwt-helper';
import { setGlobalUserLoginInfo, tryAutoLogin } from '../../utils/user-helper';
import { useSearchParam } from '@/hooks/useSearchParam';
import { useNavToView } from './utils';
import { openModal } from '@/components/Modal';
import { ServiceUrlSettings } from '@/components/modals/ServiceUrlSettings';
import { LanguageSelect } from '@/components/LanguageSelect';
import { pluginLoginAction } from '@/plugin/common';
import styles from './LoginView.module.less';


export const LoginView: React.FC = React.memo(() => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const navRedirect = useSearchParam('redirect');
  const { pathname } = useLocation();
  const { serverName, disableGuestLogin, disableUserRegister } =
    useGlobalConfigStore((state) => ({
      serverName: state.serverName,
      disableGuestLogin: state.disableGuestLogin,
      disableUserRegister: state.disableUserRegister,
    }));

  useEffect(() => {
    tryAutoLogin()
      .then(() => {
        navigate('/main');
      })
      .catch(() => {});
  }, []);

  const [{ loading, error }, handleLogin] = useAsyncFn(async () => {
    await string()
      .email(t('邮箱格式不正确'))
      .required(t('邮箱不能为空'))
      .validate(email);

    await string()
      .min(6, t('密码不能低于6位'))
      .required(t('密码不能为空'))
      .validate(password);

    const data = await loginWithEmail(email, password);

    setGlobalUserLoginInfo(data);
    await setUserJWT(data.token);

    if (isValidStr(navRedirect) && navRedirect !== pathname) {
      navigate(decodeURIComponent(navRedirect));
    } else {
      navigate('/main');
    }
  }, [email, password, navRedirect, pathname, navigate]);

  const navToView = useNavToView();

  return (
    <div className={styles.loginContainer}>
      {/* 品牌标识 */}
      <div className={styles.brand}>
        <div className={styles.logo}>
          <Icon icon="mdi:chat-bubble-outline" />
        </div>
        <h1 className={styles.title}>
          {t('登录 {{serverName}}', {
            serverName: serverName || '序语·空间',
          })}
        </h1>
      </div>

      {/* 登录表单 */}
      <div className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>{t('邮箱')}</label>
          <input
            type="email"
            className={styles.input}
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
        </div>

        <div className={styles.inputGroup}>
          <div className={styles.labelRow}>
            <label className={styles.label}>{t('密码')}</label>
            <button
              className={styles.forgetLink}
              onClick={() => navToView('/entry/forget')}
            >
              {t('忘记密码？')}
            </button>
          </div>
          <input
            type="password"
            className={styles.input}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
        </div>

        {loading === false && error && (
          <div className={styles.error}>
            <Icon icon="mdi:alert-circle" className={styles.errorIcon} />
            <span>{error.message}</span>
          </div>
        )}

        <button
          className={styles.submitBtn}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <span className={styles.spinner} />
          ) : (
            <span>{t('登录')}</span>
          )}
        </button>
      </div>

      {/* 其他方式链接 */}
      <div className={styles.altLinks}>
        {!disableUserRegister && (
          <button
            className={styles.altLink}
            onClick={() => navToView('/entry/register')}
            disabled={loading}
          >
            {t('注册账号')}
          </button>
        )}
        {!disableGuestLogin && (
          <button
            className={styles.altLink}
            onClick={() => navToView('/entry/guest')}
            disabled={loading}
          >
            {t('游客访问')}
          </button>
        )}
      </div>

      {/* 插件登录 */}
      {pluginLoginAction.length > 0 && (
        <div className={styles.pluginArea}>
          {pluginLoginAction.map((item) => {
            const { name, component: Component } = item;
            return <Component key={name} />;
          })}
        </div>
      )}

      {/* 底部工具 */}
      <div className={styles.footer}>
        <button
          className={styles.footerBtn}
          onClick={() => openModal(<ServiceUrlSettings />)}
        >
          <Icon icon="mdi:cog" />
        </button>
        <LanguageSelect size="middle" />
      </div>
    </div>
  );
});
LoginView.displayName = 'LoginView';
