// 知树玩法数值常量与配置

/** 成长经验阈值（幼苗 → 成树） */
export const EXP_MAX = 100;

/** 浇水获得经验（消耗 1 水分） */
export const EXP_PER_WATER = 10;

/** 施肥获得经验（消耗 1 肥料） */
export const EXP_PER_FERTILIZE = 15;

/** 初始资源 */
export const INITIAL_RESOURCES = {
  coins: 0,
  water: 2,
  fertilizer: 2,
};

/** 看新闻奖励：每条详情 +1000 水 +1000 肥 */
export const NEWS_REWARD = {
  water: 1000,
  fertilizer: 1000,
};

/** 每日奖励上限（按自然日重置） */
export const DAILY_REWARD_LIMIT = {
  water: 10000,
  fertilizer: 10000,
};

/** 收获奖励金币 */
export const HARVEST_COIN = 30;

/** 远程新闻 JSON 地址（需替换为实际仓库地址；真机需在小程序后台配置合法域名） */
export const NEWS_REMOTE_URL =
  'https://raw.githubusercontent.com/1785454358/Po-Jian/main/news-pipeline/data/news.json';

/** 本地存储 key */
export const STORAGE_KEY = 'zhishu-game-state';
