import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface ResourceBarProps {
  water: number;
  fertilizer: number;
  coins: number;
}

interface ResourceItemProps {
  label: string;
  value: number;
  color: string;
}

const ResourceItem: React.FC<ResourceItemProps> = ({ label, value, color }) => (
  <View className={styles.item}>
    <Text className={styles.itemLabel}>{label}</Text>
    <Text className={styles.itemValue} style={{ color }}>
      {value}
    </Text>
  </View>
);

/** 顶部资源栏：水 / 肥 / 金币 */
const ResourceBar: React.FC<ResourceBarProps> = ({ water, fertilizer, coins }) => {
  return (
    <View className={styles.container}>
      <ResourceItem label="水" value={water} color="#4A90E2" />
      <ResourceItem label="肥" value={fertilizer} color="#FF8C5A" />
      <ResourceItem label="金币" value={coins} color="#F7B500" />
    </View>
  );
};

export default ResourceBar;
