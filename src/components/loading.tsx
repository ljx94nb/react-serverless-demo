/**
 * @name logo组件
 * @author liuguisheng
 * @version 2020-09-16 08:48:54 星期三
 */
import React from 'react';
import { Spin } from 'antd';

export const Loading = (props) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: '0',
        top: '0',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)'
      }}
    >
      <Spin tip="Loading..." />
    </div>
  );
};
