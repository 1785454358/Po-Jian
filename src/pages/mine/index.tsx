import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useGameStore } from '@/store/useGameStore';
import { SPECIES_LIST } from '@/data/species';
import StatCard from '@/components/StatCard';
import CustomTabBar from '@/components/CustomTabBar';
import styles from './index.module.scss';

const MinePage: React.FC = () => {
  const coins = useGameStore((s) => s.coins);
  const water = useGameStore((s) => s.water);
  const fertilizer = useGameStore((s) => s.fertilizer);
  const harvestedCount = useGameStore((s) => s.harvestedCount);
  const unlockedSpecies = useGameStore((s) => s.unlockedSpecies);
  const resetGame = useGameStore((s) => s.resetGame);

  const handleReset = () => {
    Taro.showModal({
      title: '清空数据',
      content: '将清空所有养成进度与金币，确定继续吗？',
      confirmText: '清空',
      confirmColor: '#F53F3F',
      success: (res) => {
        if (res.confirm) {
          resetGame();
          Taro.showToast({ title: '已清空', icon: 'success' });
        }
      },
    });
  };

  const handleAbout = () => {
    Taro.showModal({
      title: '关于知树',
      content: '知树 v1.0.0\n看新闻，养树木，让知识自然生长。',
      showCancel: false,
      confirmText: '知道了',
    });
  };

  return (
    <View className={styles.page}>
      <ScrollView scrollY className={styles.body}>
        <View className={styles.header}>
          <View className={styles.avatar}>
            <Text className={styles.avatarText}>树</Text>
          </View>
          <Text className={styles.nickname}>知树旅人</Text>
          <Text className={styles.sub}>
            已解锁 {unlockedSpecies.length} / {SPECIES_LIST.length} 种树
          </Text>
        </View>

        <View className={styles.statGrid}>
          <StatCard label="金币" value={coins} color="#F7B500" />
          <StatCard label="累计收获" value={harvestedCount} unit="棵" />
          <StatCard label="当前水分" value={water} color="#4A90E2" />
          <StatCard label="当前肥料" value={fertilizer} color="#F5A623" />
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>设置</Text>
          <View className={styles.list}>
            <View className={styles.listItem} onClick={handleAbout}>
              <Text className={styles.listText}>关于知树</Text>
              <Text className={styles.listArrow}>{'>'}</Text>
            </View>
            <View className={styles.listItem} onClick={handleReset}>
              <Text className={styles.listText}>清空数据</Text>
              <Text className={styles.listArrow}>{'>'}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <CustomTabBar current={2} />
    </View>
  );
};

export default MinePage;
