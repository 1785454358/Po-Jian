import { useState, useEffect, useCallback } from 'react';
import type { NewsData, Domain } from '@/types/news';
import { DOMAIN_LIST } from '@/types/news';
import { fetchNews } from '@/services/news';

/** 新闻列表加载与领域切换 */
export function useNews() {
  const [news, setNews] = useState<NewsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeDomain, setActiveDomain] = useState<Domain>(DOMAIN_LIST[0]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchNews()
      .then((data) => {
        if (mounted) {
          setNews(data);
          setLoading(false);
        }
      })
      .catch((e) => {
        console.error('[useNews] 加载失败', e);
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const changeDomain = useCallback((d: Domain) => setActiveDomain(d), []);

  const list = news?.domains[activeDomain] ?? [];

  return { news, loading, activeDomain, changeDomain, list };
}
