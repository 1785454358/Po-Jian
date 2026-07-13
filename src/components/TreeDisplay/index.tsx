import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import type { TreeSpecies, TreeStage } from '@/types/tree';
import styles from './index.module.scss';

interface TreeDisplayProps {
  species: TreeSpecies;
  stage: TreeStage;
  exp: number;
  expMax: number;
}

/** 树木展示组件：Image 组件 + flex 底部对齐 + 逐品种 width/margin-bottom 微调 */
const TreeDisplay: React.FC<TreeDisplayProps> = ({ species, stage, exp, expMax }) => {
  const percent = Math.min(100, Math.round((exp / expMax) * 100));
  const isSeedling = stage === 'seedling';
  const treeImage = isSeedling ? species.seedlingImage : species.matureImage;
  const tweakClass = isSeedling ? styles.seedling : styles[species.id];

  return (
    <View className={styles.wrapper}>
      <View className={styles.imageBox}>
        <Image
          src={treeImage}
          mode="widthFix"
          className={`${styles.treeImage} ${tweakClass}`}
        />
      </View>
      <View className={styles.meta}>
        <Text className={styles.name}>{species.name}</Text>
        <View className={styles.stageRow}>
          <View className={styles.stageDot} />
          <Text className={styles.stage}>
            {isSeedling ? '幼苗 · 成长中' : '成树 · 可收获'}
          </Text>
        </View>
      </View>
      {isSeedling && (
        <View className={styles.progressWrap}>
          <View className={styles.progressTrack}>
            <View className={styles.progressFill} style={{ width: `${percent}%` }} />
          </View>
          <View className={styles.progressInfo}>
            <Text className={styles.progressLabel}>成长进度</Text>
            <Text className={styles.progressText}>
              {exp} / {expMax}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default TreeDisplay;
