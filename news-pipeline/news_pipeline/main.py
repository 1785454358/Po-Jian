"""管线入口：抓取 -> 清洗 -> 分组 -> LLM 加工 -> 输出。"""

from .fetcher import fetch_all
from .cleaner import clean
from .classifier import group_and_top
from .llm import get_client, process_item
from .output import build_and_write


def main():
    print("[Pipeline] 开始抓取...")
    raw = fetch_all()
    print(f"[Pipeline] 原始条目: {len(raw)}")

    items = clean(raw)
    print(f"[Pipeline] 清洗后: {len(items)}")

    groups = group_and_top(items)
    total = sum(len(v) for v in groups.values())
    print(f"[Pipeline] 分组 Top: {total} 条，待 LLM 加工")

    client = get_client()
    for domain, lst in groups.items():
        for it in lst:
            r = process_item(client, it)
            it["llm_content"] = r["content"]
            it["llm_tags"] = r["tags"]

    build_and_write(groups)
    print("[Pipeline] 完成")
