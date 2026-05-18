import { getLinkPreview } from 'link-preview-js';

/**
 * 请求管理
 */
const cacheRequestList: Record<string, Promise<any>> = {};

/**
 * 获取网页元数据信息
 * @param url 网址
 * @returns
 */
export async function fetchLinkPreview(url: string): Promise<any> {
  if (cacheRequestList[url]) {
    // 如果有正在请求的信息
    return Promise.resolve(cacheRequestList[url]);
  }

  const promise = getLinkPreview(url, {
    followRedirects: 'follow',
    timeout: 8000,
    headers: {
      'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36',
    },
  });
  cacheRequestList[url] = promise;

  return Promise.resolve(promise).finally(() => {
    setTimeout(() => {
      delete cacheRequestList[url];
    }, 2 * 1000); // 窗口期, 请求完毕后2s内依旧会复用原来的接口
  });

  // return promise;
}
