import { observable, action } from 'mobx';
import { requestUserCount } from '@/api';

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
  async setLineData(dateStr) {
    const countArr = await requestUserCount({ dateStr });
    this.line_data = this.line_data.map((item, index) => ({
      hour: item.hour,
      value: countArr[index],
      name: '人数'
    }));
  }
}

export default HomeStore;
