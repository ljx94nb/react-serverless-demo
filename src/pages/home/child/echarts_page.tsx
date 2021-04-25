import React, { useEffect, useState } from 'react';
import { DatePicker, message, Tooltip, Button } from 'antd';
import moment from 'moment';
import { DualAxes } from '@ant-design/charts';
import { inject, observer } from 'mobx-react';
import { Loading, CloudWords, HotMapModel } from '@/components';
import { useLoadHotPlaceMap } from '@/hooks';

interface IProps {
  homeStore: any;
}

const Page = (props: IProps) => {
  const [dataIndex, setDataIndex] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isSpeech, setIsSpeech] = useState(false); // 浏览器录音开启状态
  const [dateStr, setDateStr] = useState('2016-08-01');
  const [visible, setVisible] = useState(false);
  const data = props.homeStore.line_data;
  const config = {
    data: [data, data],
    xField: 'hour',
    yField: ['userCount', 'length'],
    meta: {
      length: {
        alias: '出行距离',
        formatter: function formatter(v) {
          return Number(Number(v).toFixed(2));
        }
      },
      userCount: {
        alias: '出行人数'
      }
    },
    geometryOptions: [
      {
        geometry: 'column',
        color: '#5B8FF9'
      },
      {
        geometry: 'line',
        smooth: true,
        color: '#5AD8A6',
        lineStyle: {
          lineWidth: 4,
          opacity: 0.8
        },
        label: {},
        point: {
          shape: 'circle',
          size: 4,
          style: {
            opacity: 0.5,
            stroke: '#5AD8A6',
            fill: '#fff'
          }
        }
      }
    ],
    xAxis: {
      label: {
        autoRotate: false,
        autoHide: false,
        autoEllipsis: false
      },
      tickCount: data.length / 2
    },
    yAxis: {
      length: {
        label: {
          formatter: function formatter(v) {
            return ''.concat(v, 'km');
          }
        }
      },
      userCount: {
        label: {
          formatter: function formatter(v) {
            return ''.concat(v, '人');
          }
        }
      }
    },
    legend: {
      itemName: {
        formatter: function formatter(text, item) {
          return item.value === 'length' ? '出行距离(km)' : '出行人数(人)';
        }
      }
    }
  };

  // 生成加载热点地区地图的方法
  const { loadHotPlaceMap } = useLoadHotPlaceMap('map');

  useEffect(() => {
    props.homeStore.setLineData('2016-08-01').then(() => {
      setLoading(false);
    });
  }, []);

  // 切换日期
  const onChange = async (date, dateStr) => {
    setLoading(true);
    const numArr = dateStr.split('-');
    const day = Number(numArr[numArr.length - 1]);
    setDataIndex(day);
    try {
      loadHotPlaceMap(day);
      await props.homeStore.setLineData(dateStr);
      setDateStr(dateStr);
    } catch (error) {
      message.error('没找到相应图表');
    }
    setLoading(false);
  };

  const disabledDate = (current) => {
    // 时间器选择范围：2016-08-01 到 2016-08-31
    return (
      current < moment('2016-08-01', 'YYYY-MM-DD') || current > moment('2016-08-31', 'YYYY-MM-DD')
    );
  };

  // 处理录音
  const handleSpeech = () => {
    if (!window.webkitSpeechRecognition) {
      message.warn('您的浏览器暂不支持语音识别功能');
      return;
    }
    setIsSpeech(true);
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'cmn-Hans-CN'; //普通话 (中国大陆)
    recognition.start();
    recognition.onresult = function (e) {
      try {
        const transcript = e.results[0][0].transcript;
        // console.log(transcript);
        const numArr = getDateStr(transcript);
        // console.log(numArr);
        if (numArr.length === 1) {
          numArr.splice(0, 0, '2016', '08');
        } else if (numArr.length === 2) {
          numArr.splice(0, 0, '2016');
        }
        onChange(null, numArr.join('-'));
      } catch (err) {
        message.error('小罗识别不了哦，再说一次吧~');
      }
    };
    recognition.onerror = function (err) {
      message.error('语音识别失败');
      console.error(err);
    };
    recognition.onend = function () {
      setIsSpeech(false);
    };
  };

  // 提取年月日
  const getDateStr = (str: string) => {
    const numArr = str.match(/\d+/g);
    return numArr;
  };

  const openDayHotMap = (dateStr: string) => {
    setVisible(true);
  };

  return (
    <div className="echarts-page">
      <div className="datepicker-container">
        <DatePicker
          onChange={onChange}
          showToday={false}
          disabledDate={disabledDate}
          value={moment(dateStr, 'YYYY-MM-DD')}
        />
        <Tooltip title="目前暂时只有上海市2016年8月份的单车数据">
          <span className="select-tip">* 请选择相应的日期</span>
        </Tooltip>
        {/* {isSpeech ? (
          <img className="audio-pic" src="/luyin.png" alt="audio" />
        ) : (
          <img className="audio-pic" src="/yuyin.png" alt="audio" onClick={() => handleSpeech()} />
        )} */}
      </div>
      <Button type="primary" size="large" onClick={() => openDayHotMap(dateStr)}>
        {dateStr} 出行人数动态热力图
      </Button>
      <div className="line-container">
        <div className="line-map">
          <DualAxes {...config} />
        </div>
        <CloudWords
          requestUrl="/mock/dayCloudmapData.json"
          dataIndex={dataIndex}
          fontSize={[8, 32]}
          width="600px"
          height="400px"
        />
        {loading ? <Loading /> : null}
      </div>
      <div style={{ width: '100%', height: '400px', position: 'relative' }} id="map" />
      <HotMapModel visible={visible} setVisible={setVisible} dateStr={dateStr} />
    </div>
  );
};

export default inject('homeStore')(observer(Page));
