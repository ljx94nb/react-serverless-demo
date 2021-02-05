import React from 'react';
import { List, Tag } from 'antd';

export const OrderStatus = () => {
  const data = [
    '订单号874923，停车不规范。',
    '订单号304964，停车不规范。',
    '订单号414373，停车不规范。',
    '订单号127679，骑行超出运营区范围。',
    '订单号811687，停车不规范。',
    '订单号447755，骑行超出运营区范围。',
    '订单号1061967，停车不规范。',
    '订单号1469824，骑行超出运营区范围。',
    '订单号1499176，停车不规范。',
    '订单号495882，骑行超出运营区范围。',
    '订单号535989，骑行超出运营区范围。',
    '订单号874923，停车不规范。',
    '订单号682855，骑行超出运营区范围。',
    '订单号1541709，停车不规范。',
    '订单号1591973，骑行超出运营区范围。'
  ];

  return (
    <div className="sall-action">
      <div className="title">订单状态:</div>
      <List
        split={true}
        className="list-container"
        size="large"
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <Tag color={'#dc4140'} key={'违规'}>
              违规
            </Tag>{' '}
            {item}
          </List.Item>
        )}
      />
    </div>
  );
};
