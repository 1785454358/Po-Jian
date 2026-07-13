"""数据清洗：标准化、去重、垃圾过滤、热度计算。"""

import re
from difflib import SequenceMatcher
from datetime import datetime
from dateutil import parser as dateparser

from .config import SPAM_KEYWORDS, DEDUP_THRESHOLD


def _normalize(text: str) -> str:
    return re.sub(r"\s+", "", text or "").lower()


def _similarity(a: str, b: str) -> float:
    return SequenceMatcher(None, _normalize(a), _normalize(b)).ratio()


def _dedup(items):
    result = []
    for it in items:
        if any(_similarity(it["title"], x["title"]) >= DEDUP_THRESHOLD for x in result):
            continue
        result.append(it)
    return result


def _is_spam(item) -> bool:
    text = (item.get("title", "") + item.get("summary", "")).lower()
    return any(k.lower() in text for k in SPAM_KEYWORDS)


def _calc_hot_score(item) -> int:
    """热度计算：
    - 热搜榜：按排名换算
    - Hacker News：用 points（归一化到 0-100）
    - 媒体资讯：新鲜度加权
    """
    kind = item.get("kind")
    if kind == "hotlist":
        return max(0, 100 - item.get("rank", 0) * 3)
    if kind == "hn":
        return min(100, item.get("points", 0))
    # media: 新鲜度加权
    try:
        pub = item.get("published", "")
        if pub:
            dt = dateparser.parse(pub)
            now = datetime.now(dt.tzinfo) if dt.tzinfo else datetime.now()
            hours = (now - dt).total_seconds() / 3600
            return max(10, round(100 - hours * 2))
    except Exception:
        pass
    return 50


def clean(items):
    """过滤垃圾 + 去重 + 计算热度。"""
    items = [it for it in items if it.get("title") and not _is_spam(it)]
    items = _dedup(items)
    for it in items:
        it["hot_score"] = _calc_hot_score(it)
    return items
