"""管线配置：数据源、领域关键词、阈值、LLM 与输出路径。"""

import os
from dotenv import load_dotenv

# 加载 .env 文件（不影响已存在的系统环境变量）
load_dotenv()

# RSS 源：(完整URL, 来源名, 领域)
# 每个源预设所属领域，抓取时直接分配，无需关键词分类
RSS_SOURCES = [
    # ========== 科技（3个RSS + HN）==========
    ("https://sspai.com/feed", "少数派", "科技"),
    ("https://www.ifanr.com/feed", "爱范儿", "科技"),
    ("https://www.solidot.org/index.rss", "Solidot", "科技"),
    # ========== 经济（2个）==========
    ("https://rsshub.rssforever.com/36kr/newsflashes", "36氪", "经济"),
    ("https://rsshub.rssforever.com/huxiu/article", "虎嗅", "经济"),
    # ========== 国内（2个）==========
    ("https://plink.anyfeeder.com/zaobao/realtime/china", "联合早报-中国", "国内"),
    ("https://rsshub.rssforever.com/thepaper/featured", "澎湃新闻", "国内"),
    # ========== 文娱（1个）==========
    ("https://www.gcores.com/rss", "机核", "文娱"),
    # ========== 国际（2个）==========
    ("http://feeds.bbci.co.uk/news/world/rss.xml", "BBC", "国际"),
    ("https://feeds.reuters.com/reuters/topNews", "Reuters", "国际"),
]

# 每个 RSS 源最多抓取条目数（避免超大 feed 拖慢管线）
RSS_MAX_ITEMS = 30

# Hacker News 官方 API（无鉴权）
HN_TOP_STORIES_URL = "https://hacker-news.firebaseio.com/v0/topstories.json"
HN_ITEM_URL = "https://hacker-news.firebaseio.com/v0/item/{id}.json"
HN_FETCH_COUNT = 15
HN_CHANNEL = "科技"

# 领域关键词字典（仅作 fallback，源已预设 channel 时直接使用）
DOMAIN_KEYWORDS = {
    "科技": ["科技", "技术", "芯片", "互联网", "软件", "数据", "算法", "机器人",
            "代码", "模型", "新能源", "电动", "智能", "半导体",
            "tech", "ai", "software", "code", "robot", "chip", "semiconductor",
            "algorithm", "model", "openai", "gpt", "llm", "startup", "app",
            "digital", "cyber", "cloud", "platform", "developer"],
    "经济": ["A股", "股市", "央行", "基金", "黄金", "汇率", "人民币", "上市",
            "融资", "消费", "零售", "财经", "经济", "通胀", "利率", "债券",
            "stock", "market", "fed", "fund", "gold", "ipo", "economy",
            "inflation", "rate", "bond", "dollar", "crypto", "bitcoin"],
    "国内": ["国务院", "政策", "政府", "就业", "城市", "乡村", "铁路", "规划",
            "基层", "改革", "全国", "人大", "部委", "省委", "社会"],
    "文娱": ["电影", "票房", "音乐", "节", "博物馆", "视频", "健身",
            "夜经济", "文旅", "演出", "综艺", "剧集",
            "movie", "music", "video", "game", "social", "culture",
            "entertainment", "streaming", "celebrity"],
    "国际": ["国际", "全球", "世界", "美国", "欧洲", "日本", "俄罗斯", "乌克兰",
            "联合国", "外交", "气候", "油价", "太空", "北约",
            "global", "world", "europe", "nato", "un", "diplomatic",
            "climate", "space", "spacex", "war", "treaty", "summit"],
}

# 垃圾内容过滤关键词
SPAM_KEYWORDS = ["广告", "加微信", "扫码", "点击领取", "福利群", "引流", "兼职", "代购"]

# 每域保留条数
TOP_N = 10

# 去重相似度阈值（0-1）
DEDUP_THRESHOLD = 0.8

# LLM 配置（OpenAI 兼容，默认 MiMo）
LLM_BASE_URL = os.getenv("NEWS_LLM_BASE_URL", "https://token-plan-cn.xiaomimimo.com/v1")
LLM_API_KEY = os.getenv("NEWS_LLM_API_KEY") or os.getenv("Mimo_API_KEY", "")
LLM_MODEL = os.getenv("NEWS_LLM_MODEL", "mimo-v2.5-pro")

# 输出目录：news-pipeline/data/
_OUTPUT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data"))
OUTPUT_DIR = os.getenv("OUTPUT_DIR", _OUTPUT_DIR)
OUTPUT_FILE = "news.json"
