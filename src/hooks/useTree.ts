import Taro from '@tarojs/taro';
import { useGameStore } from '@/store/useGameStore';
import type { SpeciesId } from '@/types/tree';

export interface TreeActionResult {
  ok: boolean;
  message: string;
}

/** 树木养成动作封装（返回结果，由页面自定义反馈） */
export function useTree() {
  const waterTree = useGameStore((s) => s.waterTree);
  const fertilizeTree = useGameStore((s) => s.fertilizeTree);
  const harvest = useGameStore((s) => s.harvest);
  const plantTree = useGameStore((s) => s.plantTree);
  const unlockSpecies = useGameStore((s) => s.unlockSpecies);

  return {
    doWater: (): TreeActionResult => waterTree(),
    doFertilize: (): TreeActionResult => fertilizeTree(),
    doHarvest: (): TreeActionResult => harvest(),
    doPlant: (id: SpeciesId): TreeActionResult => plantTree(id),
    doUnlock: (id: SpeciesId): TreeActionResult => {
      const r = unlockSpecies(id);
      if (r.ok) {
        Taro.showToast({ title: r.message, icon: 'success', duration: 1500 });
      } else {
        Taro.showToast({ title: r.message, icon: 'none', duration: 1500 });
      }
      return r;
    },
  };
}
