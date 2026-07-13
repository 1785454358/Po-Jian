import React from 'react';
import { View, Text, Button } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';

type ButtonType = 'water' | 'fertilize' | 'primary' | 'harvest' | 'ghost';

interface ActionButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  type?: ButtonType;
  sublabel?: string;
}

const ICONS: Record<ButtonType, string> = {
  water: '💧',
  fertilize: '🌾',
  primary: '✨',
  harvest: '🌟',
  ghost: '🌱',
};

/** 通用操作按钮（大卡片样式，触控友好） */
const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  onClick,
  disabled = false,
  type = 'primary',
  sublabel,
}) => {
  return (
    <Button
      className={classnames(styles.btn, styles[type], disabled && styles.disabled)}
      disabled={disabled}
      onClick={onClick}
    >
      <View className={styles.content}>
        <Text className={styles.icon}>{ICONS[type]}</Text>
        <Text className={styles.label}>{label}</Text>
        {sublabel ? <Text className={styles.sublabel}>{sublabel}</Text> : null}
      </View>
    </Button>
  );
};

export default ActionButton;
