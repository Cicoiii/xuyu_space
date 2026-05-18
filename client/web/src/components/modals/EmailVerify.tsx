import { setGlobalUserLoginInfo } from '@/utils/user-helper';
import React, { useState } from 'react';
import {
  model,
  showSuccessToasts,
  t,
  useAppDispatch,
  useAsyncRequest,
  userActions,
  useUserInfo,
} from 'tailchat-shared';
import { createMetaFormSchema, metaFormFieldSchema } from 'tailchat-design';
import { ModalWrapper } from '../Modal';
import { Button, Input } from 'antd';
import { Icon } from 'tailchat-design';
import { Problem } from '../Problem';
import './EmailVerify.less';

const schema = createMetaFormSchema({
  emailOTP: metaFormFieldSchema
    .string()
    .length(6, t('校验码为6位'))
    .required(t('校验码不能为空')),
});

export const EmailVerify: React.FC<{
  onSuccess?: () => void;
}> = React.memo((props) => {
  const dispatch = useAppDispatch();
  const [sended, setSended] = useState(false);
  const [emailOTP, setEmailOTP] = useState('');
  const userInfo = useUserInfo();

  const [{ loading }, handleSendEmail] = useAsyncRequest(async () => {
    if (!userInfo) {
      return;
    }

    await model.user.verifyEmail(userInfo.email);
    setSended(true);
  }, [userInfo?.email]);

  const [, handleVerifyEmail] = useAsyncRequest(
    async () => {
      await schema.validate({
        emailOTP,
      });

      const data = await model.user.verifyEmailWithOTP(emailOTP);

      setGlobalUserLoginInfo(data);
      dispatch(userActions.setUserInfo(data));

      showSuccessToasts(t('邮箱验证通过'));

      if (typeof props.onSuccess === 'function') {
        props.onSuccess();
      }
    },
    [userInfo?.email, props.onSuccess]
  );

  if (!userInfo) {
    return <Problem />;
  }

  return (
    <ModalWrapper className="email-verify-modal" title={t('认证邮箱')}>
      <div className="email-verify-hero">
        <div className="email-verify-icon">
          <Icon icon="mdi:email-seal-outline" />
        </div>
        <div>
          <div className="email-verify-title">
            {t('为可信公益协作确认邮箱')}
          </div>
          <div className="email-verify-desc">
            {t('邮箱认证用于保护账号、找回密码和接收必要安全通知。')}
          </div>
        </div>
      </div>

      <div className="email-verify-address">
        <span>{t('认证邮箱')}</span>
        <strong>{userInfo.email}</strong>
      </div>

      <div className="email-verify-steps">
        <div className={sended ? 'is-done' : 'is-current'}>
          <span>1</span>
          {t('发送验证码')}
        </div>
        <div className={sended ? 'is-current' : ''}>
          <span>2</span>
          {t('输入验证码')}
        </div>
      </div>

      {!sended ? (
        <div className="email-verify-actions">
          <Button
            className="email-verify-primary"
            type="primary"
            block={true}
            size="large"
            loading={loading}
            onClick={handleSendEmail}
            icon={<Icon icon="mdi:send" />}
          >
            {t('发送认证验证码')}
          </Button>
          <Button
            type="text"
            block={true}
            onClick={() => setSended(true)}
          >
            {t('已发送认证邮件')}
          </Button>
        </div>
      ) : (
        <div className="email-verify-form">
          <div className="email-verify-sent">
            <Icon icon="mdi:check-circle-outline" />
            <span>
              {t('验证码已发送, 请查收邮箱 {{email}}', {
                email: userInfo.email,
              })}
            </span>
          </div>

          <div className="email-verify-label">
            <span>{t('邮箱校验码')}</span>
            <button disabled={loading} onClick={handleSendEmail}>
              {t('重新发送')}
            </button>
          </div>
          <Input
            size="large"
            maxLength={6}
            value={emailOTP}
            placeholder={t('6位校验码')}
            onChange={(e) => setEmailOTP(e.target.value)}
            onPressEnter={handleVerifyEmail}
          />
          <Button
            className="email-verify-primary"
            type="primary"
            block={true}
            size="large"
            disabled={emailOTP.length !== 6}
            onClick={handleVerifyEmail}
            icon={<Icon icon="mdi:check-decagram-outline" />}
          >
            {t('完成认证')}
          </Button>
        </div>
      )}
    </ModalWrapper>
  );
});
EmailVerify.displayName = 'EmailVerify';
