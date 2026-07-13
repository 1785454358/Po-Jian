import { View, Text, Image, Button } from '@tarojs/components';
import { useState, useEffect } from 'react';
import styles from './index.module.scss';

export default function TreePage() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 模拟进度动画
    const timer = setTimeout(() => setProgress(35), 500);
    return () => clearTimeout(timer);
  }, []);

  const addWater = () => setProgress(p => Math.min(p + 10, 100));
  const addFert = () => setProgress(p => Math.min(p + 15, 100));

  return (
    <View className={styles.appContainer}>
      {/* 装饰粒子 */}
      <View className={`${styles.particle} ${styles.p1}`} />
      <View className={`${styles.particle} ${styles.p2}`} />
      <View className={`${styles.particle} ${styles.p3}`} />
      <View className={`${styles.particle} ${styles.p4}`} />

      {/* 顶部资源栏 */}
      <View className={styles.resourceBar}>
        <View className={styles.resourceItem}>
          <Text className={styles.resourceLabel}>水</Text>
          <Text className={`${styles.resourceValue} ${styles.resourceWater}`}>984</Text>
        </View>
        <View className={styles.resourceItem}>
          <Text className={styles.resourceLabel}>肥</Text>
          <Text className={`${styles.resourceValue} ${styles.resourceFert}`}>946</Text>
        </View>
        <View className={styles.resourceItem}>
          <Text className={styles.resourceLabel}>金币</Text>
          <Text className={`${styles.resourceValue} ${styles.resourceCoin}`}>370</Text>
        </View>
        <View className={styles.treeBtn}>
          <Text>🌱 树种</Text>
        </View>
      </View>

      {/* 主内容区 */}
      <View className={styles.mainArea}>
        <View className={`${styles.cloud} ${styles.cloud1}`} />
        <View className={`${styles.cloud} ${styles.cloud2}`} />
        <View className={`${styles.cloud} ${styles.cloud3}`} />

        {/* 树苗 SVG - 用 Image 组件加载本地 SVG */}
        <Image
          className={styles.treeSvg}
          src={require('@/assets/tree-sapling.svg')}  // 或网络地址
          mode="aspectFit"
        />

        <View className={styles.treeInfo}>
          <Text className={styles.treeName}>樱花树</Text>
          <View className={styles.treeStatus}>
            <View className={styles.statusDot} />
            <Text>幼苗 · 成长中</Text>
          </View>
        </View>

        <View className={styles.progressWrap}>
          <View className={styles.progressTrack}>
            <View
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            />
          </View>
          <View className={styles.progressText}>
            <Text>成长进度</Text>
            <Text>{progress} / 100</Text>
          </View>
        </View>
      </View>

      {/* 操作按钮 */}
      <View className={styles.actionBar}>
        <View className={`${styles.actionBtn} ${styles.btnWater}`} onClick={addWater}>
          <Text className={styles.btnIcon}>💧</Text>
          <Text className={styles.btnLabel}>浇水</Text>
          <Text className={styles.btnSub}>水 984</Text>
        </View>
        <View className={`${styles.actionBtn} ${styles.btnFert}`} onClick={addFert}>
          <Text className={styles.btnIcon}>🌾</Text>
          <Text className={styles.btnLabel}>施肥</Text>
          <Text className={styles.btnSub}>肥 946</Text>
        </View>
      </View>

      {/* 底部导航 */}
      <View className={styles.bottomNav}>
        <View className={`${styles.navItem} ${styles.navActive}`}>
          <Text className={styles.navIcon}>🌿</Text>
          <Text className={styles.navLabel}>育知</Text>
        </View>
        <View className={styles.navItem}>
          <Text className={styles.navIcon}>📚</Text>
          <Text className={styles.navLabel}>知讯</Text>
        </View>
        <View className={styles.navItem}>
          <Text className={styles.navIcon}>👤</Text>
          <Text className={styles.navLabel}>我的</Text>
        </View>
      </View>
    </View>
  );
}