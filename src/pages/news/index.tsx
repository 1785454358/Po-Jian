import React, { useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useNews } from '@/hooks/useNews';
import { useGameStore } from '@/store/useGameStore';
import { DOMAIN_LIST } from '@/types/news';
import { DAILY_REWARD_LIMIT } from '@/utils/constants';
import { isToday } from '@/utils/date';
import DomainTabs from '@/components/DomainTabs';
import NewsCard from '@/components/NewsCard';
import CustomTabBar from '@/components/CustomTabBar';
import styles from './index.module.scss';

const NewsPage: React.FC = () => {
  const { loading, activeDomain, changeDomain, list } = useNews();
  const dailyReward = useGameStore((s) => s.dailyReward);

  const remaining = useMemo(() => {
    const claimed = isToday(dailyReward.date) ? dailyReward.waterClaimed : 0;
    return Math.max(0, DAILY_REWARD_LIMIT.water - claimed);
  }, [dailyReward]);

  const goDetail = (index: number) => {
    Taro.navigateTo({
      url: `/pages/news-detail/index?domain=${encodeURIComponent(activeDomain)}&index=${index}`,
    });
  };

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.title}>知讯</Text>
        <View className={styles.rewardTip}>
          <Text className={styles.rewardText}>阅读领水肥 · 今日剩余 {remaining} 次</Text>
        </View>
      </View>

      <DomainTabs domains={DOMAIN_LIST} active={activeDomain} onChange={changeDomain} />

      <ScrollView scrollY className={styles.body}>
        {loading ? (
          <View className={styles.stateBox}>
            <Text className={styles.stateText}>加载中...</Text>
          </View>
        ) : list.length === 0 ? (
          <View className={styles.stateBox}>
            <Text className={styles.stateText}>暂无该领域的新闻</Text>
          </View>
        ) : (
          <View className={styles.list}>
            {list.map((item, idx) => (
              <NewsCard key={`${item.origin_title}-${idx}`} item={item} onClick={() => goDetail(idx)} />
            ))}
          </View>
        )}
      </ScrollView>

      <CustomTabBar current={1} />
    </View>
  );
};

export default NewsPage;
