import React, { Component } from 'react';
import { Map } from 'react-amap';
import { Radio } from 'antd';

interface Props {
  path: [][];
  zoom: number;
}

interface State {
  mapPlugins: string[];
  map: any;
}

const YOUR_AMAP_KEY = '5d8a8dd1fcc6c74b4f7217e311e046c0';
const VERSION = '1.4.15';
export default class MapPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      map: null,
      mapPlugins: ['Scale', 'MapType', 'OverView']
    };
  }

  private marker;
  private amapEvents = {
    created: (map) => {
      this.setState({
        map
      });
    }
  };

  startAnimation = (marker, path) => {
    marker.moveAlong(path, 200);
  };

  pauseAnimation = (marker) => {
    marker.pauseMove();
  };

  resumeAnimation = (marker) => {
    marker.resumeMove();
  };

  stopAnimation = (marker) => {
    marker.stopMove();
  };

  handleAnimationChange = (e) => {
    const value = e.target.value;
    const { path } = this.props;
    switch (value) {
      case 'start':
        this.startAnimation(this.marker, path);
        break;
      case 'pause':
        this.pauseAnimation(this.marker);
        break;
      case 'resume':
        this.resumeAnimation(this.marker);
        break;
      case 'stop':
        this.stopAnimation(this.marker);
        break;
    }
  };

  // 生成path
  createPath = (path) => {
    const { map } = this.state;
    map.clearMap();
    if (path.length) {
      this.marker = new window.AMap.Marker({
        map: map,
        position: path[0],
        icon: new window.AMap.Icon({
          size: new window.AMap.Size(50, 50),
          imageSize: new window.AMap.Size(50, 50),
          image:
            'https://6d79-my-serverless-2gk2td9k79b09fc4-1301218476.tcb.qcloud.la/diandongzihangche-cemian.png?sign=1a6ef52d892a9a57d74748bee93aaf56&t=1611071157'
        }),
        offset: new window.AMap.Pixel(-26, -32),
        autoRotation: true,
        angle: 0
      });

      // 绘制轨迹
      const polyline = new window.AMap.Polyline({
        map: map,
        path,
        showDir: true,
        strokeColor: '#28F', //线颜色
        // strokeOpacity: 1,     //线透明度
        strokeWeight: 6 //线宽
        // strokeStyle: "solid"  //线样式
      });

      const passedPolyline = new window.AMap.Polyline({
        map: map,
        // path: lineArr,
        strokeColor: '#AF5', //线颜色
        // strokeOpacity: 1,     //线透明度
        strokeWeight: 6 //线宽
        // strokeStyle: "solid"  //线样式
      });

      this.marker.on('moving', function (e) {
        passedPolyline.setPath(e.passedPath);
      });

      map.setFitView();
    }
  };

  componentDidUpdate() {
    const { path } = this.props;
    // console.log(path, map);
    this.createPath(path);
  }

  render() {
    const { mapPlugins } = this.state;
    const { zoom } = this.props;

    return (
      <div className="map-page">
        <Map
          amapkey={YOUR_AMAP_KEY}
          plugins={mapPlugins}
          version={VERSION}
          zoom={zoom}
          events={this.amapEvents}
        />
        <Radio.Group className="btn-group" onChange={this.handleAnimationChange}>
          <Radio.Button value="start">开始动画</Radio.Button>
          <Radio.Button value="pause">暂停动画</Radio.Button>
          <Radio.Button value="resume">继续动画</Radio.Button>
          <Radio.Button value="stop">结束动画</Radio.Button>
        </Radio.Group>
      </div>
    );
  }
}
