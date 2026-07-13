import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Button, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { useGameStore } from '@/store/useGameStore';
import { fetchNews, findNewsItem } from '@/services/news';
import type { NewsItem, Domain } from '@/types/news';
import styles from './index.module.scss';

const NewsDetailPage: React.FC = () => {
  const router = useRouter();
  const claimNewsReward = useGameStore((s) => s.claimNewsReward);
  const [item, setItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const claimedRef = useRef(false);

  const domain = decodeURIComponent(router.params.domain || '') as Domain;
  const index = Number(router.params.index ?? 0);

  // 加载新闻内容
  useEffect(() => {
    fetchNews()
      .then(() => {
        setItem(findNewsItem(domain, index));
      })
      .catch((e) => {
        console.error('[NewsDetail] 加载失败', e);
      })
      .finally(() => setLoading(false));
  }, []);

  // 进入详情即发放奖励（仅一次）
  useEffect(() => {
    if (claimedRef.current) return;
    claimedRef.current = true;
    const r = claimNewsReward();
    Taro.showToast({ title: r.message, icon: r.ok ? 'success' : 'none', duration: 1800 });
  }, [claimNewsReward]);

  const copyLink = () => {
    if (!item?.link) {
      Taro.showToast({ title: '暂无原文链接', icon: 'none' });
      return;
    }
    Taro.setClipboardData({
      data: item.link,
      success: () => {
        Taro.showToast({ title: '原文链接已复制', icon: 'success' });
      },
      fail: () => {
        Taro.showToast({ title: '复制失败', icon: 'none' });
      },
    });
  };

  const handleBack = () => {
    Taro.navigateBack({ delta: 1 }).catch(() => {
      Taro.switchTab({ url: '/pages/news/index' });
    });
  };

  if (loading) {
    return (
      <View className={styles.page}>
        <View className={styles.header}>
          <View className={styles.backBtn} onClick={handleBack}>
            <Text className={styles.backText}>返回</Text>
          </View>
        </View>
        <View className={styles.stateBox}>
          <Text className={styles.stateText}>加载中...</Text>
        </View>
      </View>
    );
  }

  if (!item) {
    return (
      <View className={styles.page}>
        <View className={styles.header}>
          <View className={styles.backBtn} onClick={handleBack}>
            <Text className={styles.backText}>返回</Text>
          </View>
        </View>
        <View className={styles.stateBox}>
          <Text className={styles.stateText}>新闻不存在或已过期</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.backBtn} onClick={handleBack}>
          <Text className={styles.backText}>返回</Text>
        </View>
      </View>
      <ScrollView scrollY className={styles.body}>
        <View className={styles.metaRow}>
          <Text className={styles.source}>{item.source}</Text>
          <Text className={styles.time}>{item.publish_time}</Text>
        </View>
        <Text className={styles.title}>{item.origin_title}</Text>
        <Text className={styles.content}>{item.show_content}</Text>
        {item.tags && item.tags.length > 0 && (
          <View className={styles.tags}>
            {item.tags.map((t, i) => (
              <Text className={styles.tag} key={`${t}-${i}`}>
                {t}
              </Text>
            ))}
          </View>
        )}
        <View className={styles.tipBox}>
          <Text className={styles.tipText}>
            本内容由 AI 基于原文片段客观精简，不代表平台立场。如需查看完整报道，可复制原文链接。
          </Text>
        </View>
      </ScrollView>
      <View className={styles.actionBar}>
        <Button className={styles.copyBtn} onClick={copyLink}>
          复制原文链接
        </Button>
      </View>
    </View>
  );
};

export default NewsDetailPage;
