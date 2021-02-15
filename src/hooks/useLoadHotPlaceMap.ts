import { useEffect } from 'react';

export const useLoadHotPlaceMap = () => {
  useEffect(() => {
    loadHotPlaceMap();
  }, []);

  const loadHotPlaceMap = (day = 1) => {
    fetch('/mock/dayCloudmapData.json')
      .then((res) => res.json())
      .then((data) => {
        // console.log(data[day]);
        var map = new window.AMap.Map('map', {
          features: ['bg', 'road', 'building', 'point'],
          mapStyle: 'amap://styles/grey',
          pitch: 50,
          zoom: 11,
          center: [121.4737, 31.23],
          viewMode: '3D'
        });

        var layer = new window.Loca.ScatterPointLayer({
          map: map,
          eventSupport: true
        });

        var list = data[day].map(function (item) {
          return {
            name: item.name,
            coord: `${item.longitude},${item.latitude}`,
            value: +item.value
          };
        });
        const valueList = list.map((i) => i.value);
        valueList.sort();
        const minValue = valueList[0];
        const maxValue = valueList[valueList.length - 1];

        layer.setData(list, {
          lnglat: 'coord'
        });

        var colors = ['#0553A1', '#0B79B0', '#10B3B0', '#7CCF98', '#DCE872'];

        layer.setOptions({
          // 设定棱柱体顶点数量, 默认 16，呈现圆柱体
          //vertex: 4,
          // 单位米
          unit: 'meter',
          light: {
            // 环境光
            ambient: {
              // 光照颜色
              color: '#ffffff',
              // 光照强度，范围 [0, 1]
              intensity: 0.5
            },
            // 平行光
            directional: {
              color: '#ffffff',
              // 光照方向，是指从地面原点起，光指向的方向。
              // 数组分别表示 X 轴、Y 轴、Z 轴。
              // 其中 X 正向朝东、Y 正向朝南、Z 正向朝地下。
              direction: [1, -1.5, 2],
              intensity: 0.6
            }
          },
          style: {
            // 正多边形半径
            radius: 500,
            height: {
              key: 'value',
              value: [minValue * 1000, maxValue * 1000]
            },
            // 顶边颜色
            color: {
              key: 'value',
              scale: 'quantile',
              value: colors
            },
            opacity: 0.9,
            // 旋转角度，单位弧度
            rotate: (Math.PI / 180) * 45
          },
          selectStyle: {
            color: '#fcff19',
            opacity: 0.9
          }
        });

        layer.on('mousemove', (ev) => {
          window.openInfoWin(map, ev.originalEvent, {
            位置: ev.rawData.name,
            热度: ev.rawData.value
          });
        });

        layer.render();

        // 光照
        map.DirectionLight = new window.AMap.Lights.DirectionLight([0, -1, 2], [1, 1, 1], 0.7);

        // 动态改变光照方向
        var angle = 90;
        function changeLightDirection() {
          angle += 2;
          var dir = [Math.cos((angle / 180) * Math.PI), -Math.sin((angle / 180) * Math.PI), 2];
          map.DirectionLight.setDirection(dir);
          map.render();
          AMap.Util.requestAnimFrame(changeLightDirection);
        }

        changeLightDirection();
      });
  };

  return { loadHotPlaceMap };
};
