import React, { useEffect, useRef } from 'react';
import { Modal } from 'antd';
import { Scene, HeatmapLayer } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';

export function HotMapModel(props: any) {
  const { visible, setVisible, dateStr } = props;
  const sceneRef = useRef(null);

  useEffect(() => {
    sceneRef.current === null && visible && renderMap();
  }, [visible]);

  const renderMap = () => {
    sceneRef.current = new Scene({
      id: 'hot-map-model',
      map: new Mapbox({
        style: 'dark',
        pitch: 0,
        center: [127.5671666579043, 7.445038892195569],
        zoom: 2.632456779444394
      })
    });
    sceneRef.current.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/basement_prod/d3564b06-670f-46ea-8edb-842f7010a7c6.json'
      )
        .then((res) => res.json())
        .then((data) => {
          const layer = new HeatmapLayer({})
            .source(data)
            .shape('heatmap')
            .size('mag', [0, 1.0]) // weight映射通道
            .style({
              intensity: 2,
              radius: 20,
              opacity: 1.0,
              rampColors: {
                colors: [
                  '#FF4818',
                  '#F7B74A',
                  '#FFF598',
                  '#91EABC',
                  '#2EA9A1',
                  '#206C7C'
                ].reverse(),
                positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0]
              }
            });
          sceneRef.current.addLayer(layer);
        });
    });
  };

  return (
    <Modal
      width="80%"
      visible={visible}
      title={`${dateStr} 出行人数动态热力图`}
      footer={null}
      centered
      maskClosable={false}
      onCancel={() => setVisible(false)}
    >
      <div id="hot-map-model" style={{ width: '100%', height: '400px', position: 'relative' }} />
    </Modal>
  );
}
