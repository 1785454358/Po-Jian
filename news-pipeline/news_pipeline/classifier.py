"""领域分组：优先源预设 channel，fallback 关键词匹配 + 每域 Top N。"""

from .config import DOMAIN_KEYWORDS, TOP_N


def classify(item) -> str:
    """优先使用源预设 channel，无 channel 时按关键词命中归类，未命中归'国际'。"""
    channel = item.get("channel")
    if channel and channel in DOMAIN_KEYWORDS:
        return channel
    text = (item.get("title", "") + item.get("summary", "")).lower()
    best_domain = None
    best_score = 0
    for domain, keywords in DOMAIN_KEYWORDS.items():
        score = sum(1 for k in keywords if k.lower() in text)
        if score > best_score:
            best_score = score
            best_domain = domain
    return best_domain or "国际"


def group_and_top(items):
    """按领域分组，每域按热度降序取 Top N。"""
    groups = {d: [] for d in DOMAIN_KEYWORDS.keys()}
    for it in items:
        d = classify(it)
        it["domain"] = d
        groups[d].append(it)
    result = {}
    for d, lst in groups.items():
        lst.sort(key=lambda x: x.get("hot_score", 0), reverse=True)
        result[d] = lst[:TOP_N]
    return result
