import React, { Component } from 'react';
import { Map, Polygon, Markers } from 'react-amap';
import { message, Radio, Popover } from 'antd';

interface Props {
  path: [][];
  zoom: number;
  districtPath?: number[][];
  operationPath: number[][];
  center: number[];
  rowId?: string;
  changeSelectedRowId?: Function;
  isOperationOpen?: boolean;
  isDistrictionOpen?: boolean;
  largeMarkers: any[];
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

  private markers = [];
  private polyline;
  private oldCenter;
  private rowIds: string[] = [];
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
    const { path, rowId } = this.props;
    const marker = this.markers.filter((item) => item.Ce.extData.rowId === rowId)[0];

    try {
      switch (value) {
        case 'start':
          this.startAnimation(marker, path);
          break;
        case 'pause':
          this.pauseAnimation(marker);
          break;
        case 'resume':
          this.resumeAnimation(marker);
          break;
        case 'stop':
          this.stopAnimation(marker);
          break;
      }
    } catch (error) {
      message.error('请先点击查看路线');
    }
  };

  // 生成path
  createPath = (path, rowId) => {
    const { map } = this.state;
    if (!map) {
      message.error('地图还没加载出来哦，请刷新重试~');
      return;
    }
    if (this.rowIds.includes(rowId)) {
      map.panTo(path[0]);
      map.setZoom(17);
      return;
    }
    // map.clearMap(this.polyline);
    if (path.length) {
      const marker = new window.AMap.Marker({
        map: map,
        position: path[0],
        icon: new window.AMap.Icon({
          size: new window.AMap.Size(50, 50),
          imageSize: new window.AMap.Size(50, 50),
          image: '/diandongche.png'
        }),
        offset: new window.AMap.Pixel(-26, -32),
        autoRotation: true,
        angle: 0,
        clickable: true,
        extData: { rowId, path }
      });

      this.markers.push(marker);

      // 绘制轨迹
      this.polyline = new window.AMap.Polyline({
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

      marker.on('moving', function (e) {
        passedPolyline.setPath(e.passedPath);
      });

      marker.on('click', (e) => {
        const extData = e.target.Ce.extData;
        const rowId = extData.rowId;
        const path = extData.path;
        this.props.changeSelectedRowId(rowId, path);
      });

      map.setFitView();

      this.rowIds.push(rowId);
    }
  };

  renderMarkerLayout = (extData) => {
    // console.log(extData);
    let className = 'order-id-marker-null';
    if (extData.tag === '合规') {
      className = 'order-id-marker-correct';
    } else if (extData.tag === '违规') {
      className = 'order-id-marker-error';
    } else if (extData.tag === '警告') {
      className = 'order-id-marker-warn';
    }
    return (
      <Popover content={extData.tag + '条例'} title={extData.tag + '详情'}>
        <div className={className}>订单id：{extData.orderId}</div>
      </Popover>
    );
  };

  componentWillReceiveProps() {
    this.oldCenter = this.props.center;
  }

  componentDidUpdate() {
    if (JSON.stringify(this.oldCenter) !== JSON.stringify(this.props.center)) return;
    this.createPath(this.props.path, this.props.rowId);
  }

  // componentWillMount() {
  //   window.emitter.on('create_path', (path) => this.createPath(path));
  // }

  // componentWillUnmount() {
  //   window.emitter.off('create_path');
  // }

  render() {
    const { mapPlugins } = this.state;
    const {
      zoom,
      districtPath,
      operationPath,
      center,
      isOperationOpen,
      isDistrictionOpen,
      largeMarkers
    } = this.props;

    return (
      <div className="map-page">
        <Map
          amapkey={YOUR_AMAP_KEY}
          plugins={mapPlugins}
          version={VERSION}
          zoom={zoom}
          events={this.amapEvents}
          center={center}
        >
          {isDistrictionOpen ? (
            <Polygon
              path={districtPath}
              draggable={false}
              visible={true}
              style={{
                fillColor: '#b4adff',
                fillOpacity: 0.6,
                strokeWeight: 1,
                strokeColor: '#b4adff'
              }}
            />
          ) : null}
          {isOperationOpen ? (
            <Polygon
              path={operationPath}
              draggable={false}
              visible={true}
              style={{
                fillColor: '#3ba992',
                fillOpacity: 0.3,
                strokeWeight: 1,
                strokeColor: '#3ba992'
              }}
            />
          ) : null}
          <Markers useCluster={true} markers={largeMarkers} render={this.renderMarkerLayout} />
        </Map>
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
