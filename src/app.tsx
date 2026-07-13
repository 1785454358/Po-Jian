import React, { useEffect } from 'react';
import { useDidShow, useDidHide } from '@tarojs/taro';
// 全局样式
import './app.scss';

// 云开发环境 ID：开通云开发后，在「云开发控制台 -> 设置 -> 环境信息」复制环境 ID 填入此处
const CLOUD_ENV = 'your-cloud-env-id';

function App(props) {
  // 可以使用所有的 React Hooks
  useEffect(() => {
    // 初始化云开发（仅小程序端；H5/RN 端无 wx.cloud）
    if (process.env.TARO_ENV === 'weapp') {
      // @ts-ignore wx 仅在小程序端存在
      wx.cloud.init({ env: CLOUD_ENV, traceUser: true });
    }
  }, []);

  // 对应 onShow
  useDidShow(() => {});

  // 对应 onHide
  useDidHide(() => {});

  return props.children;
}

export default App;
