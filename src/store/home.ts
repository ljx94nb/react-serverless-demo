import { observable, action } from 'mobx';
import { requestBikeData, requestAddress, requestUserCount } from '@/api';

class HomeStore {
  @observable
  home = 0;
  str = '首页';
  bike_data = [];
  line_data = [
    { hour: '01 : 00', value: 3 },
    { hour: '02 : 00', value: 4 },
    { hour: '03 : 00', value: 3.5 },
    { hour: '04 : 00', value: 5 },
    { hour: '05 : 00', value: 4.9 },
    { hour: '06 : 00', value: 6 },
    { hour: '07 : 00', value: 7 },
    { hour: '08 : 00', value: 9 },
    { hour: '09 : 00', value: 13 },
    { hour: '10 : 00', value: 3 },
    { hour: '11 : 00', value: 4 },
    { hour: '12 : 00', value: 3.5 },
    { hour: '13 : 00', value: 5 },
    { hour: '14 : 00', value: 4.9 },
    { hour: '15 : 00', value: 6 },
    { hour: '16 : 00', value: 7 },
    { hour: '17 : 00', value: 9 },
    { hour: '18 : 00', value: 13 },
    { hour: '19 : 00', value: 3 },
    { hour: '20 : 00', value: 4 },
    { hour: '21 : 00', value: 3.5 },
    { hour: '22 : 00', value: 5 },
    { hour: '23 : 00', value: 4.9 },
    { hour: '24 : 00', value: 6 }
  ];

  @action
  add() {
    this.home += 1;
  }

  @action
  less() {
    this.home -= 1;
  }

  @action
  setBikeData(data: any) {
    this.bike_data = data;
  }

  @action
  async getBikeData(currPage: number, pageSize: number) {
    try {
      const data = await requestBikeData(currPage, pageSize);
      for (const item of data) {
        item['start_time_num'] = new Date(item.start_time).getTime();
        item['end_time_num'] = new Date(item.end_time).getTime();
        const startLocation = await requestAddress({
          location: item.start_location_y + ',' + item.start_location_x
        });
        const endLocation = await requestAddress({
          location: item.end_location_y + ',' + item.end_location_x
        });
        item['start_location'] = startLocation;
        item['end_location'] = endLocation;
        item.track = item.track.split('#').map((item) => item.split(',').map((d) => Number(d)));
      }
      this.bike_data = data;
    } catch (error) {
      throw error;
    }
  }

  @action
  async setLineData(dateStr) {
    const countArr = await requestUserCount({ dateStr });
    this.line_data = this.line_data.map((item, index) => ({
      hour: item.hour,
      value: countArr[index]
    }));
  }
}

export default HomeStore;
