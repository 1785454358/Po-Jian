import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { GameState, SpeciesId, ActionResult } from '@/types/tree';
import { taroStorage } from '@/utils/storage';
import {
  STORAGE_KEY,
  EXP_MAX,
  EXP_PER_WATER,
  EXP_PER_FERTILIZE,
  INITIAL_RESOURCES,
  NEWS_REWARD,
  DAILY_REWARD_LIMIT,
  HARVEST_COIN,
} from '@/utils/constants';
import { today, isToday } from '@/utils/date';
import { getSpecies } from '@/data/species';

interface GameActions {
  /** 种植新树 */
  plantTree: (speciesId: SpeciesId) => ActionResult;
  /** 浇水 */
  waterTree: () => ActionResult;
  /** 施肥 */
  fertilizeTree: () => ActionResult;
  /** 收获成树 */
  harvest: () => ActionResult;
  /** 解锁新品种 */
  unlockSpecies: (speciesId: SpeciesId) => ActionResult;
  /** 领取看新闻奖励（进详情即调用） */
  claimNewsReward: () => ActionResult;
  /** 重置全部游戏数据 */
  resetGame: () => void;
  /** 获取今日剩余可领奖励次数 */
  getDailyRemaining: () => number;
}

export type GameStore = GameState & GameActions;

const initialState: GameState = {
  coins: INITIAL_RESOURCES.coins,
  water: INITIAL_RESOURCES.water,
  fertilizer: INITIAL_RESOURCES.fertilizer,
  currentTree: null,
  unlockedSpecies: ['oak', 'ginkgo'],
  harvestedCount: 0,
  dailyReward: { date: '', waterClaimed: 0, fertilizerClaimed: 0 },
};

/** 规整每日奖励记录（跨天则重置） */
function normalizeDaily(daily: GameState['dailyReward']): GameState['dailyReward'] {
  if (!isToday(daily.date)) {
    return { date: today(), waterClaimed: 0, fertilizerClaimed: 0 };
  }
  return daily;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      plantTree: (speciesId) => {
        const state = get();
        if (state.currentTree) {
          return { ok: false, message: '已有正在养成的树木' };
        }
        if (!state.unlockedSpecies.includes(speciesId)) {
          return { ok: false, message: '该树种尚未解锁' };
        }
        set({
          currentTree: { speciesId, stage: 'seedling', exp: 0, harvested: false },
        });
        return { ok: true, message: `${getSpecies(speciesId).name}已种下` };
      },

      waterTree: () => {
        const state = get();
        if (!state.currentTree || state.currentTree.stage !== 'seedling') {
          return { ok: false, message: '当前没有可浇水的幼苗' };
        }
        if (state.water <= 0) {
          return { ok: false, message: '水分不足，去知讯看看新闻吧' };
        }
        const tree = state.currentTree;
        const newExp = tree.exp + EXP_PER_WATER;
        const matured = newExp >= EXP_MAX;
        set({
          water: state.water - 1,
          currentTree: {
            ...tree,
            exp: matured ? EXP_MAX : newExp,
            stage: matured ? 'mature' : 'seedling',
          },
        });
        return { ok: true, message: matured ? '树木已长成成树，可以收获了' : `浇水成功，经验+${EXP_PER_WATER}` };
      },

      fertilizeTree: () => {
        const state = get();
        if (!state.currentTree || state.currentTree.stage !== 'seedling') {
          return { ok: false, message: '当前没有可施肥的幼苗' };
        }
        if (state.fertilizer <= 0) {
          return { ok: false, message: '肥料不足，去知讯看看新闻吧' };
        }
        const tree = state.currentTree;
        const newExp = tree.exp + EXP_PER_FERTILIZE;
        const matured = newExp >= EXP_MAX;
        set({
          fertilizer: state.fertilizer - 1,
          currentTree: {
            ...tree,
            exp: matured ? EXP_MAX : newExp,
            stage: matured ? 'mature' : 'seedling',
          },
        });
        return { ok: true, message: matured ? '树木已长成成树，可以收获了' : `施肥成功，经验+${EXP_PER_FERTILIZE}` };
      },

      harvest: () => {
        const state = get();
        if (!state.currentTree || state.currentTree.stage !== 'mature') {
          return { ok: false, message: '树木还未成熟' };
        }
        set({
          coins: state.coins + HARVEST_COIN,
          harvestedCount: state.harvestedCount + 1,
          currentTree: null,
        });
        return { ok: true, message: `收获成功，获得${HARVEST_COIN}金币` };
      },

      unlockSpecies: (speciesId) => {
        const state = get();
        if (state.unlockedSpecies.includes(speciesId)) {
          return { ok: false, message: '该树种已解锁' };
        }
        const cost = getSpecies(speciesId).unlockCost;
        if (state.coins < cost) {
          return { ok: false, message: `金币不足，还需${cost - state.coins}金币` };
        }
        set({
          coins: state.coins - cost,
          unlockedSpecies: [...state.unlockedSpecies, speciesId],
        });
        return { ok: true, message: `${getSpecies(speciesId).name}已解锁` };
      },

      claimNewsReward: () => {
        const state = get();
        const daily = normalizeDaily(state.dailyReward);
        if (daily.waterClaimed >= DAILY_REWARD_LIMIT.water) {
          return { ok: false, message: '今日奖励已领满，明日再来' };
        }
        set({
          water: state.water + NEWS_REWARD.water,
          fertilizer: state.fertilizer + NEWS_REWARD.fertilizer,
          dailyReward: {
            date: daily.date,
            waterClaimed: daily.waterClaimed + NEWS_REWARD.water,
            fertilizerClaimed: daily.fertilizerClaimed + NEWS_REWARD.fertilizer,
          },
        });
        return { ok: true, message: `获得水分+${NEWS_REWARD.water}，肥料+${NEWS_REWARD.fertilizer}` };
      },

      getDailyRemaining: () => {
        const daily = normalizeDaily(get().dailyReward);
        return Math.max(0, DAILY_REWARD_LIMIT.water - daily.waterClaimed);
      },

      resetGame: () => {
        set({ ...initialState, dailyReward: { date: today(), waterClaimed: 0, fertilizerClaimed: 0 } });
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => taroStorage),
      // 仅持久化数据字段，不持久化 actions
      partialize: (state) => ({
        coins: state.coins,
        water: state.water,
        fertilizer: state.fertilizer,
        currentTree: state.currentTree,
        unlockedSpecies: state.unlockedSpecies,
        harvestedCount: state.harvestedCount,
        dailyReward: state.dailyReward,
      }),
    },
  ),
);
