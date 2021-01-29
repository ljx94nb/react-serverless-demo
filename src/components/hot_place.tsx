import React from 'react';
import { CloudWords } from './cloud_words';

export const HotPlace = () => {
  return (
    <div className="sall-action">
      <div className="title">热点地区:</div>
      <CloudWords
        requestUrl="/mock/cloudmapData.json"
        fontSize={[8, 32]}
        width="800px"
        height="400px"
      />
    </div>
  );
};
