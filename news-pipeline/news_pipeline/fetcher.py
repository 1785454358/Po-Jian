"""数据抓取：直接 RSS + Hacker News API。"""

import requests
import feedparser

from .config import (
    RSS_SOURCES,
    RSS_MAX_ITEMS,
    HN_TOP_STORIES_URL,
    HN_ITEM_URL,
    HN_FETCH_COUNT,
    HN_CHANNEL,
)

UA = "Mozilla/5.0 (compatible; NewsPipeline/1.0)"


def fetch_rss():
    """抓取全部 RSS 源，返回标准化原始条目列表。"""
    items = []
    for url, source, channel in RSS_SOURCES:
        try:
            resp = requests.get(url, timeout=15, headers={"User-Agent": UA})
            resp.raise_for_status()
            feed = feedparser.parse(resp.content)
            entries = feed.entries[:RSS_MAX_ITEMS]
            for rank, entry in enumerate(entries):
                items.append({
                    "source": source,
                    "kind": "media",
                    "rank": rank,
                    "title": entry.get("title", "").strip(),
                    "link": entry.get("link", ""),
                    "summary": entry.get("summary", "").strip(),
                    "published": entry.get("published", ""),
                    "channel": channel,
                })
            print(f"[Fetcher] RSS {source} 抓取 {len(entries)} 条")
        except Exception as e:
            print(f"[Fetcher] RSS 抓取失败 {url}: {e}")
    return items


def fetch_hn():
    """抓取 Hacker News 热门条目。"""
    items = []
    try:
        ids = requests.get(HN_TOP_STORIES_URL, timeout=15).json()[:HN_FETCH_COUNT]
        for rank, item_id in enumerate(ids):
            try:
                data = requests.get(
                    HN_ITEM_URL.format(id=item_id), timeout=15
                ).json()
                items.append({
                    "source": "Hacker News",
                    "kind": "hn",
                    "rank": rank,
                    "title": data.get("title", "").strip(),
                    "link": data.get("url") or f"https://news.ycombinator.com/item?id={item_id}",
                    "summary": "",
                    "published": "",
                    "points": data.get("score", 0),
                    "channel": HN_CHANNEL,
                })
            except Exception as e:
                print(f"[Fetcher] HN 条目失败 {item_id}: {e}")
        print(f"[Fetcher] HN 抓取 {len(items)} 条")
    except Exception as e:
        print(f"[Fetcher] HN 列表失败: {e}")
    return items


def fetch_all():
    return fetch_rss() + fetch_hn()
