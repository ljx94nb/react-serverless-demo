/**
 * @name logo组件
 * @author liuguisheng
 * @version 2020-09-16 08:48:54 星期三
 */
import React from 'react';

interface Props {
  url: string;
  title: string;
  color: string;
  size: string;
  back: string;
}

export const LogoBox = (props: Props) => {
  let { url, title, color, size, back } = props;
  // 样式计算
  let transform: string = size === 'large' ? 'scale(1)' : 'scale(0.5)';
  return (
    <a
      href="https://github.com/ljx94nb/react-serverless-demo"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div id="logo-box" style={{ transform, backgroundColor: back }}>
        <img src={url} alt="" />
        <span style={{ color }}>{title}</span>
      </div>
    </a>
  );
};
