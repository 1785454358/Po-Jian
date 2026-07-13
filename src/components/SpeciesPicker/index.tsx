import React from 'react';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import classnames from 'classnames';
import type { SpeciesId } from '@/types/tree';
import { SPECIES_LIST } from '@/data/species';
import styles from './index.module.scss';

interface SpeciesPickerProps {
  visible: boolean;
  onClose: () => void;
  onPlant: (id: SpeciesId) => void;
  onUnlock: (id: SpeciesId) => void;
  unlockedSpecies: SpeciesId[];
  coins: number;
}

/** 品种选择/解锁弹层 */
const SpeciesPicker: React.FC<SpeciesPickerProps> = ({
  visible,
  onClose,
  onPlant,
  onUnlock,
  unlockedSpecies,
  coins,
}) => {
  if (!visible) return null;

  return (
    <View className={styles.root}>
      <View className={styles.mask} onClick={onClose} />
      <View className={styles.sheet}>
        <View className={styles.header}>
          <Text className={styles.title}>选择树种</Text>
          <View className={styles.coinBox}>
            <Text className={styles.coinLabel}>金币</Text>
            <Text className={styles.coinValue}>{coins}</Text>
          </View>
        </View>
        <ScrollView scrollY className={styles.list}>
          {SPECIES_LIST.map((s) => {
            const unlocked = unlockedSpecies.includes(s.id);
            const canAfford = coins >= s.unlockCost;
            return (
              <View className={styles.speciesCard} key={s.id}>
                <View className={styles.previewBox}>
                  <Image
                    src={s.matureImage}
                    mode="widthFix"
                    className={`${styles.previewImage} ${styles[s.id]}`}
                  />
                </View>
                <View className={styles.info}>
                  <Text className={styles.name}>{s.name}</Text>
                  <Text className={styles.desc}>{s.description}</Text>
                  <Text className={styles.cost}>
                    {unlocked ? '已解锁' : `解锁需 ${s.unlockCost} 金币`}
                  </Text>
                </View>
                <View
                  className={classnames(
                    styles.actionBtn,
                    unlocked ? styles.plantBtn : !canAfford ? styles.lockedBtn : styles.unlockBtn,
                  )}
                  onClick={() => (unlocked ? onPlant(s.id) : canAfford ? onUnlock(s.id) : undefined)}
                >
                  <Text className={styles.actionText}>
                    {unlocked ? '种植' : canAfford ? '解锁' : '金币不足'}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

export default SpeciesPicker;
