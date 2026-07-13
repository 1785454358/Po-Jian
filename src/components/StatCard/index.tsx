import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface StatCardProps {
  label: string;
  value: number | string;
  unit?: string;
  color?: string;
}

/** 统计卡片：展示单个数值指标 */
const StatCard: React.FC<StatCardProps> = ({ label, value, unit, color }) => {
  return (
    <View className={styles.card}>
      <Text className={styles.value} style={color ? { color } : undefined}>
        {value}
        {unit ? <Text className={styles.unit}>{unit}</Text> : null}
      </Text>
      <Text className={styles.label}>{label}</Text>
    </View>
  );
};

export default StatCard;
