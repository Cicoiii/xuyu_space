import React from 'react';
import { version } from 'tailchat-shared';
import logoUrl from '@assets/images/logo/xuyu_logo.png';
import { Icon } from 'tailchat-design';
import styles from '@/components/FullModal/FullModal.module.less';

const LogoLink: React.FC<{
  src: string;
  icon: React.ReactNode | string;
}> = React.memo((props) => {
  const { src, icon } = props;

  return (
    <a
      className={styles.aboutLink}
      href={src}
      target="_blank"
      rel="noreferrer"
    >
      {typeof icon === 'string' ? <Icon icon={icon} /> : icon}
    </a>
  );
});
LogoLink.displayName = 'LogoLink';

export const SettingsAbout: React.FC = React.memo(() => {
  return (
    <div className="select-text">
      <div className={styles.aboutHeader}>
        <img
          className={styles.aboutLogo}
          src={logoUrl}
          alt="序语空间"
        />
        <div>
          <div className={styles.aboutName}>序语空间</div>
          <div className={styles.aboutTagline}>定义无障碍交互的新标准</div>
        </div>
      </div>

      <div className={styles.aboutDesc}>
        这是一个面向听障人士打造的多维互助社区。我们不只是一个聊天工具，而是一个可以随心定义的数字化空间。
      </div>

      <div className={styles.aboutFeatures}>
        <div className={styles.aboutFeatureCard}>
          <div className={styles.aboutFeatureTitle}>多态合一</div>
          <div className={styles.aboutFeatureDesc}>
            在同一个群组里，你可以发起即时对话，也可以沉淀深度讨论。
          </div>
        </div>
        <div className={styles.aboutFeatureCard}>
          <div className={styles.aboutFeatureTitle}>自由组合</div>
          <div className={styles.aboutFeatureDesc}>
            创新的"功能频道"设计，让你像搭积木一样定制专属的社区形态。
          </div>
        </div>
        <div className={styles.aboutFeatureCard}>
          <div className={styles.aboutFeatureTitle}>无缝衔接</div>
          <div className={styles.aboutFeatureDesc}>
            无论是就业咨询还是娱乐互动，复杂的信息流在这里都变得井然有序。
          </div>
        </div>
      </div>

      <div className={styles.aboutVersion}>
        v{version}
      </div>

      <div className={styles.aboutLinks}>
        <LogoLink
          src="https://github.com/msgbyte/tailchat"
          icon="logos:github-octocat"
        />
        <LogoLink
          src="https://en.wikipedia.org/wiki/Open_source"
          icon="logos:opensource"
        />
        <LogoLink src="https://www.docker.com/" icon="logos:docker-icon" />
        <LogoLink src="https://zh-hans.reactjs.org/" icon="logos:react" />
        <LogoLink src="https://redux.js.org/" icon="logos:redux" />
        <LogoLink
          src="https://www.typescriptlang.org/"
          icon="logos:typescript-icon"
        />
      </div>
    </div>
  );
});
SettingsAbout.displayName = 'SettingsAbout';
