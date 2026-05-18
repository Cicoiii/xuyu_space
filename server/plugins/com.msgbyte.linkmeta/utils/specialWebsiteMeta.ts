import got from 'got';
import _ from 'lodash';

/**
 * 获取特定页面的信息
 */

//  <iframe src="//player.bilibili.com/player.html?aid=938355060&bvid=BV1bT4y1a7RH&cid=577883291&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>

const requestHeaders = {
  'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
  'user-agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36',
};

function normalizeUrl(url: string) {
  try {
    return new URL(url);
  } catch (e) {
    return null;
  }
}

function compactMeta<T extends Record<string, unknown>>(meta: T): Partial<T> {
  return _.pickBy(meta, (value) => {
    if (Array.isArray(value)) {
      return value.length > 0;
    }

    return value !== undefined && value !== null && value !== '';
  }) as Partial<T>;
}

function getHost(url: string) {
  return normalizeUrl(url)?.hostname.replace(/^www\./, '').toLowerCase() ?? '';
}

function isHost(url: string, hosts: string[]) {
  const host = getHost(url);

  return hosts.some((item) => host === item || host.endsWith(`.${item}`));
}

function getYouTubeVideoId(url: string) {
  const parsedUrl = normalizeUrl(url);
  if (!parsedUrl) {
    return null;
  }

  if (parsedUrl.hostname === 'youtu.be') {
    return parsedUrl.pathname.split('/').filter(Boolean)[0] ?? null;
  }

  if (parsedUrl.pathname.startsWith('/shorts/')) {
    return parsedUrl.pathname.split('/').filter(Boolean)[1] ?? null;
  }

  if (parsedUrl.pathname.startsWith('/embed/')) {
    return parsedUrl.pathname.split('/').filter(Boolean)[1] ?? null;
  }

  return parsedUrl.searchParams.get('v');
}

function getNeteaseMusicId(url: string) {
  const parsedUrl = normalizeUrl(url);
  if (!parsedUrl) {
    return null;
  }

  return parsedUrl.searchParams.get('id');
}

async function fetchJson<T = any>(url: string): Promise<T> {
  return got(url, {
    headers: requestHeaders,
    timeout: {
      request: 8000,
    },
  }).json<T>();
}

const specialWebsiteMetaFetchers = [
  {
    // bilibili
    match: (url: string) => isHost(url, ['bilibili.com']),
    overwrite: async (url: string) => {
      // from https://github.com/simon300000/bili-api/blob/master/src/api/api.bilibili.com.js
      const bvid = _.last(url.split('?')[0].split('/').filter(Boolean));

      if (!bvid?.startsWith('BV')) {
        return {};
      }

      const { data } = await fetchJson<any>(
        `https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`
      );

      const aid = _.get(data, 'aid');
      const cid = _.get(data, 'cid');
      if (aid && bvid && cid) {
        return {
          title: _.get(data, 'title'),
          siteName: '哔哩哔哩',
          description: _.get(data, 'desc'),
          images: _.get(data, 'pic') ? [_.get(data, 'pic')] : undefined,
          videos: [
            `https://player.bilibili.com/player.html?aid=${aid}&bvid=${bvid}&cid=${cid}&page=1&autoplay=0`,
          ],
        };
      }
    },
  },
  {
    // YouTube
    match: (url: string) => isHost(url, ['youtube.com', 'youtu.be']),
    overwrite: async (url: string) => {
      const videoId = getYouTubeVideoId(url);

      if (!videoId) {
        return {};
      }

      return {
        siteName: 'YouTube',
        images: [`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`],
        videos: [`https://www.youtube.com/embed/${videoId}`],
      };
    },
  },
  {
    // X / Twitter. The official page often blocks server-side preview fetches,
    // so provide a useful card fallback based on the public URL shape.
    match: (url: string) => isHost(url, ['x.com', 'twitter.com']),
    overwrite: async (url: string) => {
      const parsedUrl = normalizeUrl(url);
      const parts = parsedUrl?.pathname.split('/').filter(Boolean) ?? [];
      const username = parts[0];
      const statusId =
        parts[1] === 'status' || parts[1] === 'statuses' ? parts[2] : null;

      return compactMeta({
        title: statusId
          ? `${username ? `@${username} ` : ''}在 X 上的动态`
          : username
          ? `@${username} - X`
          : 'X',
        siteName: 'X',
        description: statusId
          ? '打开查看这条动态、评论和媒体内容。'
          : '打开查看这个 X 主页。',
      });
    },
  },
  {
    // 知乎
    match: (url: string) => isHost(url, ['zhihu.com', 'zhuanlan.zhihu.com']),
    overwrite: async (url: string) =>
      compactMeta({
        siteName: '知乎',
      }),
  },
  {
    // 网易云音乐
    match: (url: string) => isHost(url, ['music.163.com']),
    overwrite: async (url: string) => {
      const parsedUrl = normalizeUrl(url);
      const id = getNeteaseMusicId(url);

      if (!id) {
        return compactMeta({
          siteName: '网易云音乐',
        });
      }

      const path = parsedUrl?.pathname ?? '';

      if (path.includes('/song') || parsedUrl?.hash.includes('/song')) {
        try {
          const data = await fetchJson<any>(
            `https://music.163.com/api/song/detail/?ids=[${id}]`
          );
          const song = _.get(data, 'songs.0');

          return compactMeta({
            title: _.get(song, 'name'),
            siteName: '网易云音乐',
            description: (_.get(song, 'artists') ?? [])
              .map((artist) => artist.name)
              .filter(Boolean)
              .join(' / '),
            images: _.get(song, 'album.picUrl')
              ? [_.get(song, 'album.picUrl')]
              : undefined,
          });
        } catch (e) {
          return compactMeta({
            siteName: '网易云音乐',
          });
        }
      }

      if (path.includes('/playlist') || parsedUrl?.hash.includes('/playlist')) {
        return compactMeta({
          title: '网易云音乐歌单',
          siteName: '网易云音乐',
          description: `歌单 ID: ${id}`,
        });
      }

      return compactMeta({
        siteName: '网易云音乐',
      });
    },
  },
];

/**
 * 获取更多的信息
 * @param url 请求数据的地址
 */
export async function fetchSpecialWebsiteMeta(url: string) {
  const matched = specialWebsiteMetaFetchers.find((f) => f.match(url));

  if (matched) {
    try {
      const overwrite = await matched.overwrite(url);

      return overwrite ?? {};
    } catch (e) {
      return {};
    }
  }

  return {};
}
