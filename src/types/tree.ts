// 树木相关类型定义

export type SpeciesId = 'oak' | 'ginkgo' | 'flame' | 'lilac';

export type TreeStage = 'seedling' | 'mature';

/** 树种配置 */
export interface TreeSpecies {
  id: SpeciesId;
  name: string;
  seedlingImage: string;
  matureImage: string;
  seedlingTint: string;
  unlockCost: number;
  description: string;
}

/** 当前养成中的树木状态 */
export interface TreeState {
  speciesId: SpeciesId;
  stage: TreeStage;
  exp: number;
  harvested: boolean;
}

/** 每日奖励领取记录 */
export interface DailyReward {
  date: string;
  waterClaimed: number;
  fertilizerClaimed: number;
}

/** 全局游戏状态 */
export interface GameState {
  coins: number;
  water: number;
  fertilizer: number;
  currentTree: TreeState | null;
  unlockedSpecies: SpeciesId[];
  harvestedCount: number;
  dailyReward: DailyReward;
}

/** 养成操作结果 */
export interface ActionResult {
  ok: boolean;
  message: string;
}
