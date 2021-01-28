import React, { useEffect, useState } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import { Line, WordCloud } from '@ant-design/charts';
import { Scene, HeatmapLayer } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';
import { inject, observer } from 'mobx-react';
import { Loading } from '@/components';

interface IProps {
  homeStore: any;
}

const Page = (props: IProps) => {
  const [loading, setLoading] = useState(true);
  const data = props.homeStore.line_data;
  const config = {
    data,
    xField: 'hour',
    yField: 'value',
    seriesField: 'name',
    label: {},
    point: {
      size: 5,
      shape: 'diamond'
    },
    legend: { position: 'top' },
    smooth: true
    // animation: {
    //   appear: {
    //     animation: 'path-in',
    //     duration: 5000
    //   }
    // }
  };

  const [cloudData, setCloudData] = useState([]);
  useEffect(() => {
    asyncFetch();
  }, []);
  const asyncFetch = () => {
    fetch('/mock/cloudmapData.json')
      .then((response) => response.json())
      .then((json) => setCloudData(json))
      .catch((error) => {
        console.log('fetch cloudData failed', error);
      });
  };
  const cloudConfig = {
    data: cloudData,
    wordField: 'name',
    weightField: 'value',
    colorField: 'name',
    wordStyle: {
      fontFamily: 'Verdana',
      fontSize: [8, 32],
      rotation: 0
    },
    random: function random() {
      return 0.5;
    }
  };

  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      map: new Mapbox({
        style: 'dark',
        pitch: 0,
        center: [121.46, 31.224],
        zoom: 12
      })
    });
    scene.on('loaded', () => {
      fetch('/mock/heatmap.json')
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
                  '#F27DEB',
                  '#8C1EB2',
                  '#421EB2'
                ].reverse(),
                positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0]
              }
            });
          scene.addLayer(layer);
        });
    });
  }, []);

  useEffect(() => {
    props.homeStore.setLineData('2016-08-01').then(() => {
      setLoading(false);
    });
  }, [props.homeStore.line_data]);

  const onChange = async (date, dateStr) => {
    setLoading(true);
    await props.homeStore.setLineData(dateStr);
    setLoading(false);
  };

  const disabledDate = (current) => {
    // 时间器选择范围：2016-08-01 到 2016-08-31
    return (
      current < moment('2016-08-01', 'YYYY-MM-DD') || current > moment('2016-08-31', 'YYYY-MM-DD')
    );
  };

  return (
    <div className="echarts-page">
      <div className="line-container">
        <DatePicker
          onChange={onChange}
          showToday={false}
          disabledDate={disabledDate}
          defaultValue={moment('2016-08-01', 'YYYY-MM-DD')}
        />
        <div className="line-map">
          <Line {...config} />
        </div>
        {loading ? <Loading /> : null}
      </div>
      <div className="cloudMap-container">
        <WordCloud {...cloudConfig} />
      </div>
      <div style={{ width: '1200px', height: '400px', position: 'relative' }} id="map" />
    </div>
  );
};

export default inject('homeStore')(observer(Page));
