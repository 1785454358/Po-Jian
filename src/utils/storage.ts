import Taro from '@tarojs/taro';
import type { StateStorage } from 'zustand/middleware';

/**
 * Taro 本地存储适配器，供 Zustand persist 中间件使用。
 * 底层封装 Taro.setStorageSync / getStorageSync / removeStorageSync。
 */
export const taroStorage: StateStorage = {
  getItem: (name: string): string | null => {
    try {
      const value = Taro.getStorageSync(name);
      if (value === '' || value === null || value === undefined) {
        return null;
      }
      return typeof value === 'string' ? value : JSON.stringify(value);
    } catch (e) {
      console.error('[Storage] 读取失败', name, e);
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      Taro.setStorageSync(name, value);
    } catch (e) {
      console.error('[Storage] 写入失败', name, e);
    }
  },
  removeItem: (name: string): void => {
    try {
      Taro.removeStorageSync(name);
    } catch (e) {
      console.error('[Storage] 删除失败', name, e);
    }
  },
};
