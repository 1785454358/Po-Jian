import Taro from '@tarojs/taro';
import type { NewsData, Domain } from '@/types/news';
import { NEWS_REMOTE_URL } from '@/utils/constants';
import { mockNewsData } from '@/data/news-mock';

// 模块级缓存：避免列表页与详情页重复请求
let _cache: NewsData | null = null;

/**
 * 获取新闻数据。
 * 优先请求远程 JSON（GitHub Actions 产出），失败/超时回退本地 mock。
 * 真机访问 raw.githubusercontent.com 需在小程序后台配置 request 合法域名（建议挂国内代理）。
 */
export async function fetchNews(force = false): Promise<NewsData> {
  if (_cache && !force) return _cache;
  try {
    const res = await Taro.request({
      url: NEWS_REMOTE_URL,
      method: 'GET',
      timeout: 8000,
    });
    if (res.statusCode === 200 && res.data && res.data.domains) {
      _cache = res.data as NewsData;
      return _cache;
    }
    throw new Error(`新闻数据格式异常: statusCode=${res.statusCode}`);
  } catch (e) {
    console.error('[News] 远程获取失败，回退 mock', e);
    _cache = mockNewsData;
    return _cache;
  }
}

/** 读取已缓存的新闻数据（未缓存返回 null） */
export function getCachedNews(): NewsData | null {
  return _cache;
}

/** 根据领域 + 索引获取单条新闻（找不到返回 null） */
export function findNewsItem(domain: Domain, index: number) {
  const data = _cache;
  if (!data) return null;
  const list = data.domains[domain];
  if (!list || index < 0 || index >= list.length) return null;
  return list[index];
}
