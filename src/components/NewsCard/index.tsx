import React from 'react';
import { View, Text } from '@tarojs/components';
import type { NewsItem } from '@/types/news';
import styles from './index.module.scss';

interface NewsCardProps {
  item: NewsItem;
  onClick: () => void;
}

/** 新闻条目卡片 */
const NewsCard: React.FC<NewsCardProps> = ({ item, onClick }) => {
  return (
    <View className={styles.card} onClick={onClick}>
      <View className={styles.top}>
        <Text className={styles.source}>{item.source}</Text>
        <Text className={styles.hot}>热度 {item.hot_score}</Text>
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
      <Text className={styles.time}>{item.publish_time}</Text>
    </View>
  );
};

export default NewsCard;
