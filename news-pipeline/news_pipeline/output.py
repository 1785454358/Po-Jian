"""输出：组装最终 JSON 并写入 data/news.json。"""

import json
import os
from datetime import datetime, timezone

from .config import OUTPUT_DIR, OUTPUT_FILE


def build_and_write(groups):
    """组装前端渲染结构并写入文件。"""
    today_str = datetime.now(timezone.utc).astimezone().strftime("%Y-%m-%d")
    domains = {}
    for domain, items in groups.items():
        domains[domain] = [
            {
                "source": it.get("source", ""),
                "publish_time": today_str,
                "origin_title": it.get("title", ""),
                "show_content": it.get("llm_content", ""),
                "tags": it.get("llm_tags", []),
                "hot_score": it.get("hot_score", 0),
                "link": it.get("link", ""),
                "domain": domain,
            }
            for it in items
        ]
    data = {
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "domains": domains,
    }
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    path = os.path.join(OUTPUT_DIR, OUTPUT_FILE)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"[Output] 已写入 {path}（共 {sum(len(v) for v in domains.values())} 条）")
    return data
