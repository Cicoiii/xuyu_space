import { TcService, TcContext, TcDbService } from 'tailchat-server-sdk';
import type { LinkmetaDocument, LinkmetaModel } from '../models/linkmeta';
import { fetchLinkPreview } from '../utils/fetchLinkPreview';
import { fetchSpecialWebsiteMeta } from '../utils/specialWebsiteMeta';

/**
 * 链接信息服务
 */
interface LinkmetaService
  extends TcService,
    TcDbService<LinkmetaDocument, LinkmetaModel> {}
class LinkmetaService extends TcService {
  get serviceName() {
    return 'plugin:com.msgbyte.linkmeta';
  }

  onInit() {
    this.registerLocalDb(require('../models/linkmeta').default);

    this.registerAction('fetch', this.fetch, {
      params: {
        url: 'string',
      },
    });
  }

  /**
   * 获取连接预览信息
   */
  private async fetch(ctx: TcContext<{ url: string }>) {
    const url = ctx.params.url;

    const meta = await this.adapter.model.findOne(
      {
        url,
      },
      undefined,
      {
        sort: {
          _id: -1,
        },
      }
    );

    if (
      !meta ||
      new Date(meta.createdAt).valueOf() <
        new Date().valueOf() - 1000 * 60 * 60 * 24
    ) {
      // 没有找到或已过期(过期时间24小时)
      // 尝试对特定网站获取更多信息
      const overwrite = await fetchSpecialWebsiteMeta(url);
      let data: Record<string, any>;

      try {
        data = await fetchLinkPreview(url);
      } catch (e) {
        if (Object.keys(overwrite).length === 0) {
          throw e;
        }

        data = {
          url,
          title: '',
          siteName: '',
          description: '',
          mediaType: 'website',
          contentType: 'text/html',
          images: [],
          videos: [],
          favicons: [],
        };
      }

      Object.assign(data, overwrite);

      if (Array.isArray(data.videos)) {
        data.videos = data.videos
          .map((item) => (typeof item === 'string' ? item : item?.secureUrl ?? item?.url))
          .filter(Boolean);
      }

      // 转存图片
      if (Array.isArray(data.images) && data.images.length > 0) {
        try {
          const storedImages = await Promise.all(
            data.images.slice(0, 3).map(async (imageUrl) => {
              const { url } = (await ctx.call('file.saveFileWithUrl', {
                fileUrl: imageUrl,
              })) as { url: string };

              return url;
            })
          );
          data.images = storedImages;
        } catch (e) {}
      }

      await this.adapter.model.create({
        url,
        data,
      });

      return { ...data, isCache: false };
    }

    return {
      ...meta.data,
      isCache: true,
    };
  }
}

export default LinkmetaService;
