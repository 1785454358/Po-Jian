import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

interface TabItem {
  pagePath: string;
  text: string;
  icon: string;
  activeIcon: string;
}

const TAB_LIST: TabItem[] = [
  { pagePath: '/pages/cultivate/index', text: '育知', icon: '🌱', activeIcon: '🌱' },
  { pagePath: '/pages/news/index', text: '知讯', icon: '📰', activeIcon: '📰' },
  { pagePath: '/pages/mine/index', text: '我的', icon: '👤', activeIcon: '👤' },
];

interface CustomTabBarProps {
  current: number;
}

/** 自定义底部导航栏：用 emoji 图标替代原生 PNG */
const CustomTabBar: React.FC<CustomTabBarProps> = ({ current }) => {
  const handleSwitch = (index: number) => {
    if (index === current) return;
    Taro.reLaunch({ url: TAB_LIST[index].pagePath });
  };

  return (
    <View className={styles.tabBar}>
      {TAB_LIST.map((item, index) => {
        const isActive = index === current;
        return (
          <View
            key={item.pagePath}
            className={styles.tabItem}
            onClick={() => handleSwitch(index)}
          >
            <Text className={styles.tabIcon}>{isActive ? item.activeIcon : item.icon}</Text>
            <Text className={`${styles.tabText} ${isActive ? styles.tabTextActive : ''}`}>
              {item.text}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

export default CustomTabBar;
