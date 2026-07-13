import React from 'react';
import { ScrollView, View, Text } from '@tarojs/components';
import classnames from 'classnames';
import type { Domain } from '@/types/news';
import styles from './index.module.scss';

interface DomainTabsProps {
  domains: Domain[];
  active: Domain;
  onChange: (d: Domain) => void;
}

/** 领域切换标签栏（横向滚动） */
const DomainTabs: React.FC<DomainTabsProps> = ({ domains, active, onChange }) => {
  return (
    <ScrollView scrollX className={styles.tabs} enhanced showScrollbar={false}>
      <View className={styles.inner}>
        {domains.map((d) => (
          <View
            key={d}
            className={classnames(styles.tab, active === d && styles.active)}
            onClick={() => onChange(d)}
          >
            <Text className={styles.tabText}>{d}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default DomainTabs;
