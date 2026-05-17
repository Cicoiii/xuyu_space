import {
  ChatConverseInfo,
  fetchConverseInfo,
  getConverseAckInfo,
} from '../model/converse';
import {
  findGroupInviteByCode,
  getGroupBasicInfo,
  GroupBasicInfo,
  GroupInvite,
} from '../model/group';
import { getConverseLastMessageInfo } from '../model/message';
import {
  fetchLocalStaticRegistryPlugins,
  fetchRegistryPlugins,
  fetchServiceRegistryPlugins,
  PluginManifest,
} from '../model/plugin';
import { fetchUserInfo, getUserSettings, UserBaseInfo } from '../model/user';
import { parseUrlStr } from '../utils/url-helper';
import { queryClient } from './index';

export enum CacheKey {
  user = 'user',
  converse = 'converse',
  converseAck = 'converseAck',
  baseGroupInfo = 'baseGroupInfo',
  groupInvite = 'groupInvite',
  pluginRegistry = 'pluginRegistry',
  userSettings = 'userSettings',
}

export const NON_PERSISTED_CACHE_KEYS = [CacheKey.pluginRegistry] as const;

/**
 * 获取缓存的用户信息
 */
export async function getCachedUserInfo(
  userId: string,
  refetch = false
): Promise<UserBaseInfo> {
  const data = await queryClient.fetchQuery(
    [CacheKey.user, userId],
    () => fetchUserInfo(userId),
    {
      staleTime: refetch ? 0 : 2 * 60 * 60 * 1000, // 缓存2小时
    }
  );

  return data;
}

/**
 * 获取缓存的会话信息
 */
export async function getCachedConverseInfo(
  converseId: string
): Promise<ChatConverseInfo> {
  const data = await queryClient.fetchQuery(
    [CacheKey.converse, converseId],
    () => fetchConverseInfo(converseId)
  );

  return data;
}

/**
 * 获取缓存的邀请码信息
 */
export async function getCachedBaseGroupInfo(
  groupId: string
): Promise<GroupBasicInfo | null> {
  const data = await queryClient.fetchQuery(
    [CacheKey.baseGroupInfo, groupId],
    () => getGroupBasicInfo(groupId)
  );

  return data;
}

/**
 * 获取缓存的邀请码信息
 */
export async function getCachedGroupInviteInfo(
  inviteCode: string
): Promise<GroupInvite | null> {
  const data = await queryClient.fetchQuery(
    [CacheKey.groupInvite, inviteCode],
    () => findGroupInviteByCode(inviteCode)
  );

  return data;
}

/**
 * 获取缓存的用户信息
 */
export async function getCachedAckInfo(converseId: string, refetch = false) {
  const data = await queryClient.fetchQuery(
    [CacheKey.converseAck, converseId],
    () => {
      return Promise.all([
        getConverseAckInfo([converseId]).then((d) => d[0]),
        getConverseLastMessageInfo([converseId]).then((d) => d[0]),
      ]).then(([ack, lastMessage]) => {
        return {
          converseId,
          ack,
          lastMessage,
        };
      });
    },
    {
      staleTime: 2 * 1000, // 缓存2s, 减少一秒内的重复请求(无意义)
    }
  );

  return data;
}

/**
 * 获取缓存的插件列表
 */
export async function getCachedRegistryPlugins(): Promise<PluginManifest[]> {
  queryClient.removeQueries({
    queryKey: [CacheKey.pluginRegistry],
    exact: true,
  });

  const normalizeManifestUrl = (manifest: PluginManifest): PluginManifest => {
    const normalized = {
      ...manifest,
      // 后端url策略。根据前端的url在获取时自动变更为当前链接的后端地址
      url: parseUrlStr(manifest.url),
    };

    if (manifest.icon) {
      normalized.icon = parseUrlStr(manifest.icon);
    }

    if (manifest.documentUrl) {
      normalized.documentUrl = parseUrlStr(manifest.documentUrl);
    }

    return normalized;
  };

  const data = await queryClient.fetchQuery(
    [CacheKey.pluginRegistry],
    () =>
      Promise.all([
        fetchRegistryPlugins().catch(() => []),
        fetchServiceRegistryPlugins()
          .then((list) => list.map(normalizeManifestUrl))
          .catch(() => []),
        fetchLocalStaticRegistryPlugins()
          .then((list) => list.map(normalizeManifestUrl))
          .catch(() => []),
      ]).then(([a, b, c]) => {
        const all = [...a.map(normalizeManifestUrl), ...b, ...c];
        // 按 name 去重，后出现的覆盖先出现的（本地 registry 优先级高于后端）
        const seen = new Map<string, PluginManifest>();
        for (const p of all) {
          seen.set(p.name, p);
        }
        return Array.from(seen.values());
      }),
    {
      cacheTime: 0,
      staleTime: 0,
    }
  );

  return data;
}

/**
 * 获取用户配置
 */
export async function getCachedUserSettings() {
  const data = await queryClient.fetchQuery(
    [CacheKey.userSettings],
    () => getUserSettings(),
    {
      staleTime: 10 * 60 * 1000, // 缓存10分钟
    }
  );

  return data;
}
