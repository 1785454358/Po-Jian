// 新闻相关类型定义

/** 新闻领域 */
export type Domain = '科技' | '经济' | '国内' | '文娱' | '国际';

/** 领域列表（顺序固定） */
export const DOMAIN_LIST: Domain[] = ['科技', '经济', '国内', '文娱', '国际'];

/** 单条新闻（前端渲染结构） */
export interface NewsItem {
  source: string; // 来源，如"澎湃新闻"
  publish_time: string; // 'YYYY-MM-DD'
  origin_title: string; // 原始标题
  show_content: string; // LLM 精简中立正文（60-90字）
  tags: string[]; // 3 个中性关键词
  hot_score: number; // 热度分
  link: string; // 原文跳转链接
  domain: Domain;
}

/** 新闻数据集合 */
export interface NewsData {
  updated_at: string; // ISO 时间
  domains: Record<Domain, NewsItem[]>;
}
