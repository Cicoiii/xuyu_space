import {
  addFriendRequest,
  searchUserWithUniqueName,
  showErrorToasts,
  showToasts,
  t,
  Trans,
  useAppSelector,
  useAsyncFn,
  UserBaseInfo,
} from 'tailchat-shared';
import React, { useCallback, useState } from 'react';
import _isNil from 'lodash/isNil';
import { Avatar, Icon } from 'tailchat-design';
import { Highlight } from '@/components/Highlight';
import styles from './Friends.module.less';

const SearchFriendResult: React.FC<{
  result: UserBaseInfo | undefined | null;
}> = React.memo(({ result }) => {
  const [hasSentUserId, setHasSentUserId] = useState('');
  const handleAddFriend = useCallback(async (userId: string) => {
    try {
      await addFriendRequest(userId);
      setHasSentUserId(userId);
      showToasts(t('已发送申请'), 'success');
    } catch (err) {
      showErrorToasts(err);
    }
  }, []);

  if (result === undefined) {
    return null;
  }

  if (result === null) {
    return (
      <div className={styles.empty}>
        <Icon icon="mdi:account-search-outline" className={styles.emptyIcon} />
        <span>{t('没有找到该用户')}</span>
      </div>
    );
  }

  const hasSent = hasSentUserId === result._id;

  return (
    <div className={styles.searchResult}>
      <div className={styles.resultAvatar}>
        <Avatar size={44} name={result.nickname} src={result.avatar} />
      </div>
      <div className={styles.resultInfo}>
        <span className={styles.resultName}>
          {result.nickname}
          <span className={styles.resultDiscriminator}>
            #{result.discriminator}
          </span>
        </span>
      </div>
      <button
        className={`${styles.resultBtn} ${hasSent ? styles.sent : styles.accept}`}
        disabled={hasSent}
        onClick={() => handleAddFriend(result._id)}
      >
        {hasSent ? t('已申请') : t('申请好友')}
      </button>
    </div>
  );
});
SearchFriendResult.displayName = 'SearchFriendResult';

const SelfIdentify: React.FC = React.memo(() => {
  const userInfo = useAppSelector((state) => state.user.info);
  const uniqueName = `${userInfo?.nickname}#${userInfo?.discriminator}`;

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(uniqueName).then(() => {
      showToasts(t('已复制'), 'success');
    });
  }, [uniqueName]);

  return (
    <div className={styles.identifyCard}>
      <div className={styles.identifyLabel}>{t('您的个人唯一标识')}</div>
      <div className={styles.identifyValue} onClick={handleCopy}>
        {uniqueName}
      </div>
    </div>
  );
});
SelfIdentify.displayName = 'SelfIdentify';

export const AddFriend: React.FC = React.memo(() => {
  const [uniqueName, setUniqueName] = useState('');
  const [{ loading, value }, searchUser] = useAsyncFn(async () => {
    try {
      const data = await searchUserWithUniqueName(uniqueName);
      if (data === null) {
        showToasts(t('没有找到该用户'), 'warning');
      }
      return data;
    } catch (err) {
      showErrorToasts(err);
    }
  }, [uniqueName]);

  return (
    <div className={styles.addSection}>
      <div className={styles.addHint}>
        <Trans>
          您可以使用完整的{' '}
          <span className={styles.addHighlight}>用户昵称#标识</span>{' '}
          来添加好友
        </Trans>
      </div>

      <div className={styles.addInputRow}>
        <input
          className={styles.addInput}
          placeholder={t('用户昵称#0000')}
          onChange={(e) => setUniqueName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && uniqueName && searchUser()}
        />
        <button
          className={styles.addBtn}
          disabled={uniqueName === '' || loading}
          onClick={searchUser}
        >
          {loading ? t('搜索中...') : t('查找好友')}
        </button>
      </div>

      {_isNil(value) ? <SelfIdentify /> : <SearchFriendResult result={value} />}
    </div>
  );
});
AddFriend.displayName = 'AddFriend';
