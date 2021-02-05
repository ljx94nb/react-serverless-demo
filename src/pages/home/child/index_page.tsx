import React, { Component } from 'react';
import { WaveComponent, HotPlace, QuickEntry, OrderStatus } from '../../../components';
import { storage } from '../../../utils/storage_utils';

const WEEK_CONFIG = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
const CHEERS = [
  '今天也是元气满满的一天呢！',
  '积一时之跬步，臻千里之遥程。',
  '每一发奋努力的背后，必有加倍的赏赐。',
  '不想认命，就去拼命。'
];

interface Props {}

interface State {
  people: number;
}

export default class IndexPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      people: 1
    };
  }

  private countTodayTips = () => {
    let name = storage.get('username');
    let amOrPm: string = new Date().getHours() > 12 ? '下午好' : '上午好';
    let week: string = WEEK_CONFIG[new Date().getDay()];
    let time: string = new Date().toLocaleDateString();
    let tips: string = CHEERS[Math.floor(Math.random() * CHEERS.length)];

    return (
      <div className="tips">
        <div className="first">
          {amOrPm}, {name}!
        </div>
        <div className="second">
          今天是{time}, {week}
        </div>
        <div className="third">{tips}</div>
      </div>
    );
  };

  render = () => {
    return (
      <div className="index-page">
        <div className="top_message">
          {this.countTodayTips()}
          <WaveComponent background="#3ba992">
            <div className="content" title="合规">
              <i className="iconfont icon-xiaoxizhongxin"></i>
              <span className="number">合规：836</span>
            </div>
          </WaveComponent>
          <WaveComponent background="#dc4140">
            <div className="content" title="违规">
              <i className="iconfont icon-pinglun1"></i>
              <span className="number">违规：88</span>
            </div>
          </WaveComponent>
          <WaveComponent background="#f6be34">
            <div className="content" title="警告">
              <i className="iconfont icon-yulebao"></i>
              <span className="number">警告：100</span>
            </div>
          </WaveComponent>
        </div>
        <div>
          <QuickEntry></QuickEntry>
        </div>
        <div className="main-body">
          <div className="order-status">
            <OrderStatus />
          </div>
          <div className="sall-action-body">
            <HotPlace />
          </div>
        </div>
      </div>
    );
  };
}
