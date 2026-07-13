import type { TreeSpecies, SpeciesId } from '@/types/tree';
import { seedlingSvg, oakSvg, ginkgoSvg, flameSvg, lilacSvg } from './svg-data';

/**
 * 树图资源暂时使用内联 base64，不依赖云存储。
 * 后续开通云开发后可改回 cloud:// FileID。
 */
const SEEDLING_IMAGE = seedlingSvg;

const MATURE_IMAGES: Record<string, string> = {
  oak: oakSvg,
  ginkgo: ginkgoSvg,
  flame: flameSvg,
  lilac: lilacSvg,
};

/** 全部树种配置（顺序即展示顺序） */
export const SPECIES_LIST: TreeSpecies[] = [
  {
    id: 'oak',
    name: '橡树',
    seedlingImage: SEEDLING_IMAGE,
    matureImage: MATURE_IMAGES.oak,
    seedlingTint: 'none',
    unlockCost: 0,
    description: '坚韧挺拔，枝繁叶茂，象征力量与长寿。',
  },
  {
    id: 'ginkgo',
    name: '银杏树',
    seedlingImage: SEEDLING_IMAGE,
    matureImage: MATURE_IMAGES.ginkgo,
    seedlingTint: 'none',
    unlockCost: 0,
    description: '古老孑遗树种，秋日满树金黄，沉静而明亮。',
  },
  {
    id: 'flame',
    name: '凤凰木',
    seedlingImage: SEEDLING_IMAGE,
    matureImage: MATURE_IMAGES.flame,
    seedlingTint: 'none',
    unlockCost: 1,
    description: '花开如火，红艳似霞，如凤凰涅槃般绚烂。',
  },
  {
    id: 'lilac',
    name: '丁香树',
    seedlingImage: SEEDLING_IMAGE,
    matureImage: MATURE_IMAGES.lilac,
    seedlingTint: 'none',
    unlockCost: 1,
    description: '紫韵幽香，淡雅清新，承载着初夏的记忆。',
  },
];

const SPECIES_MAP: Record<SpeciesId, TreeSpecies> = SPECIES_LIST.reduce(
  (acc, s) => {
    acc[s.id] = s;
    return acc;
  },
  {} as Record<SpeciesId, TreeSpecies>,
);

/** 根据 id 获取树种配置 */
export function getSpecies(id: SpeciesId): TreeSpecies {
  return SPECIES_MAP[id];
}

/** 获取解锁某树种所需金币 */
export function getUnlockCost(id: SpeciesId): number {
  return SPECIES_MAP[id]?.unlockCost ?? 0;
}
