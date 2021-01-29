import React, { useState, useEffect } from 'react';
import { WordCloud } from '@ant-design/charts';

interface IProps {
  requestUrl: string;
  fontSize: number[];
  width: string;
  height: string;
  dataIndex?: number;
}

export const CloudWords = (props: IProps) => {
  const [cloudData, setCloudData] = useState([]);
  useEffect(() => {
    asyncFetch();
  }, [props.dataIndex]);
  const asyncFetch = () => {
    fetch(props.requestUrl)
      .then((response) => response.json())
      .then((json) => {
        if (Array.isArray(json)) setCloudData(json);
        else setCloudData(json[props.dataIndex]);
      })
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
      fontSize: props.fontSize,
      rotation: 0
    },
    random: function random() {
      return 0.5;
    }
  };

  return (
    <div style={{ width: props.width, height: props.height }}>
      <WordCloud {...cloudConfig} />
    </div>
  );
};
