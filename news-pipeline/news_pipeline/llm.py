"""LLM 单条加工：客观中立精简改写（OpenAI 兼容协议）。"""

import json
from openai import OpenAI

from .config import LLM_BASE_URL, LLM_API_KEY, LLM_MODEL

PROMPT = """你是中立新闻编辑，基于下面这条新闻原文片段处理：
【新闻标题】{title}
【原文片段】{content}
要求：
1. 输出一段60–90字简洁客观正文，不带主观评价、不夹带立场、不引申猜测；
2. 提炼3个客观中性关键词，只概括事件要素；
3. 不要多余解释、不要总结整篇榜单，仅处理本条新闻；
4. 返回纯JSON格式，key为content、tags。"""


def get_client():
    """返回 LLM 客户端；未配置 API Key 时返回 None（走保底逻辑）。"""
    if not LLM_API_KEY:
        print("[LLM] 未配置 NEWS_LLM_API_KEY，跳过 LLM 加工，使用原文片段保底")
        return None
    return OpenAI(base_url=LLM_BASE_URL, api_key=LLM_API_KEY)


def process_item(client, item):
    """单条加工，返回 {content, tags}。失败时保底用原文片段。"""
    title = item.get("title", "")
    content = (item.get("summary", "") or "")[:500]
    fallback = {"content": (content[:90] or title), "tags": []}

    if client is None:
        return fallback

    try:
        resp = client.chat.completions.create(
            model=LLM_MODEL,
            messages=[{"role": "user", "content": PROMPT.format(title=title, content=content)}],
            temperature=0.3,
            response_format={"type": "json_object"},
        )
        text = resp.choices[0].message.content.strip()
        data = json.loads(text)
        return {
            "content": data.get("content", fallback["content"]),
            "tags": data.get("tags", []) or [],
        }
    except Exception as e:
        print(f"[LLM] 加工失败 ({title[:20]}...): {e}")
        return fallback
