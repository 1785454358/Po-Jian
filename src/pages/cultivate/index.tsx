import React, { useState, useCallback, useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import { useGameStore } from '@/store/useGameStore';
import { useTree } from '@/hooks/useTree';
import { getSpecies } from '@/data/species';
import { EXP_MAX, HARVEST_COIN } from '@/utils/constants';
import ResourceBar from '@/components/ResourceBar';
import TreeDisplay from '@/components/TreeDisplay';
import ActionButton from '@/components/ActionButton';
import SpeciesPicker from '@/components/SpeciesPicker';
import CustomTabBar from '@/components/CustomTabBar';
import styles from './index.module.scss';

const CultivatePage: React.FC = () => {
  const coins = useGameStore((s) => s.coins);
  const water = useGameStore((s) => s.water);
  const fertilizer = useGameStore((s) => s.fertilizer);
  const currentTree = useGameStore((s) => s.currentTree);
  const unlockedSpecies = useGameStore((s) => s.unlockedSpecies);
  const { doWater, doFertilize, doHarvest, doPlant, doUnlock } = useTree();
  const [pickerVisible, setPickerVisible] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = useCallback((msg: string) => {
    setToast(msg);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 1500);
    return () => clearTimeout(timer);
  }, [toast]);

  const species = currentTree ? getSpecies(currentTree.speciesId) : null;

  const handleAction = (fn: () => { ok: boolean; message: string }) => {
    const r = fn();
    showToast(r.message);
  };

  return (
    <>
    <View className={styles.page}>
      <View className={styles.topBar}>
        <ResourceBar water={water} fertilizer={fertilizer} coins={coins} />
        <View className={styles.entry} onClick={() => setPickerVisible(true)}>
          <Text className={styles.entryIcon}>🌱</Text>
          <Text className={styles.entryText}>树种</Text>
        </View>
      </View>

      <View className={styles.body}>
        {currentTree && species ? (
          <View className={styles.treeCard}>
            <TreeDisplay
              species={species}
              stage={currentTree.stage}
              exp={currentTree.exp}
              expMax={EXP_MAX}
            />
          </View>
        ) : (
          <View className={styles.emptyCard}>
            <Text className={styles.emptyEmoji}>🌱</Text>
            <Text className={styles.emptyTitle}>这里还空着</Text>
            <Text className={styles.emptyDesc}>选一棵树苗种下，看它在你的照料下慢慢生长</Text>
            <View className={styles.emptyBtn} onClick={() => setPickerVisible(true)}>
              <Text className={styles.emptyBtnText}>选种</Text>
            </View>
          </View>
        )}
      </View>

      {currentTree && species && (
        <View className={styles.actionBar}>
          {currentTree.stage === 'seedling' ? (
            <>
              <ActionButton
                label="浇水"
                type="water"
                sublabel={`水 ${water}`}
                disabled={water <= 0}
                onClick={() => handleAction(doWater)}
              />
              <ActionButton
                label="施肥"
                type="fertilize"
                sublabel={`肥 ${fertilizer}`}
                disabled={fertilizer <= 0}
                onClick={() => handleAction(doFertilize)}
              />
            </>
          ) : (
            <ActionButton
              label="收获"
              type="harvest"
              sublabel={`+${HARVEST_COIN} 金币`}
              onClick={() => handleAction(doHarvest)}
            />
          )}
        </View>
      )}

      <SpeciesPicker
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        onPlant={(id) => {
          const r = doPlant(id);
          showToast(r.message);
          setPickerVisible(false);
        }}
        onUnlock={(id) => doUnlock(id)}
        unlockedSpecies={unlockedSpecies}
        coins={coins}
      />

      <CustomTabBar current={0} />
    </View>

    {toast && (
      <View className={styles.toast}>
        <Text className={styles.toastText}>{toast}</Text>
      </View>
    )}
    </>
  );
};

export default CultivatePage;
