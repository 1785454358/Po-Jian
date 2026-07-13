# 知树新闻数据管线

知树小程序「知讯」模块的数据后端：抓取多源新闻，清洗去重，按领域分组取 Top10，经 LLM 中立精简改写后输出 JSON 供小程序前端读取。

## 功能

- **多源抓取**：RSSHub 公共实例（澎湃、知乎热榜、微博热搜、36氪）+ Hacker News 官方 API
- **数据清洗**：标准化字段、标题模糊去重、垃圾内容过滤、统一热度计算
- **领域分组**：科技 / 国际 / 国内时政 / 财经 / 社会文娱，每域按热度取 Top 10
- **LLM 加工**：单条独立调用，60-90 字客观中立正文 + 3 个中性关键词，返回 JSON
- **输出**：`data/news.json`，前端直接渲染

## 环境要求

- Python 3.11.9
- [uv](https://docs.astral.sh/uv/) 包管理器

## 快速开始

### 1. 安装依赖

```bash
cd news-pipeline
uv sync
```

uv 会自动创建虚拟环境并安装全部依赖。

### 2. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env`，填入 `NEWS_LLM_API_KEY`（DeepSeek 或其他 OpenAI 兼容服务的 Key）。未配置 Key 时管线仍可运行，LLM 加工环节会保底使用原文片段。

### 3. 手动运行

```bash
uv run python -m news_pipeline
```

运行结束后检查 `data/news.json`。

## 输出结构

```json
{
  "updated_at": "2026-07-08T01:00:00+00:00",
  "domains": {
    "科技": [
      {
        "source": "Hacker News",
        "publish_time": "2026-07-08",
        "origin_title": "原始新闻标题",
        "show_content": "LLM 精简中立正文（前端展示主文案）",
        "tags": ["关键词1", "关键词2", "关键词3"],
        "hot_score": 95,
        "link": "https://原文跳转链接",
        "domain": "科技"
      }
    ],
    "国际": [],
    "国内时政": [],
    "财经": [],
    "社会文娱": []
  }
}
```

## GitHub Actions 自动运行

仓库根目录 `.github/workflows/news-fetch.yml` 配置了定时任务：

- **触发时间**：每日北京时间 09:00 和 21:00（UTC 01:00 / 13:00）
- **手动触发**：在 GitHub Actions 页面点击 "Run workflow"
- **自动提交**：运行结束后将 `data/news.json` 提交回 main 分支

### 配置 Secrets

在仓库 Settings → Secrets and variables → Actions 中添加：

| Name | Value |
|------|-------|
| `NEWS_LLM_API_KEY` | DeepSeek 或其他 OpenAI 兼容服务的 API Key |

未配置时管线仍可运行（LLM 环节走保底逻辑）。

## 目录结构

```
news-pipeline/
├── news_pipeline/
│   ├── __init__.py        # 包定义
│   ├── __main__.py        # 入口（python -m news_pipeline）
│   ├── config.py          # 配置：数据源、关键词、阈值、LLM
│   ├── fetcher.py         # 抓取：RSS + Hacker News
│   ├── cleaner.py         # 清洗：去重、过滤、热度
│   ├── classifier.py      # 分组：关键词归类 + Top N
│   ├── llm.py             # LLM：单条中立改写
│   ├── output.py          # 输出：组装 JSON 写文件
│   └── main.py            # 编排：抓取→清洗→分组→LLM→输出
├── data/
│   └── news.json          # 输出产物（运行后生成）
├── pyproject.toml         # uv 依赖配置
├── .python-version        # Python 版本锁定
├── .env.example           # 环境变量示例
└── README.md
```

## 数据源说明

| 来源 | 类型 | 热度计算方式 |
|------|------|-------------|
| 澎湃新闻 | media | 新鲜度加权 |
| 知乎热榜 | hotlist | 按排名换算 |
| 微博热搜 | hotlist | 按排名换算 |
| 36氪 | media | 新鲜度加权 |
| Hacker News | hn | points 归一化 |

## 注意事项

- 公共 RSSHub 实例（`rsshub.app`）偶尔不稳定，可通过 `RSSHUB_BASE` 环境变量切换其他公共节点
- LLM 调用为单条独立请求，避免长文本批量调用，控制成本
- 管线失败时不阻断：单条抓取/加工失败会跳过并保底，保证产出不空
