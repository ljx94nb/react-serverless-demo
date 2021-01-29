import { observable, action } from 'mobx';
import { requestUserCountAndLength } from '@/api';

class HomeStore {
  @observable
  home = 0;
  str = '首页';
  bike_data = [];
  line_data = [
    { hour: '01:00', userCount: 0, length: 0 },
    { hour: '02:00', userCount: 0, length: 0 },
    { hour: '03:00', userCount: 0, length: 0 },
    { hour: '04:00', userCount: 0, length: 0 },
    { hour: '05:00', userCount: 0, length: 0 },
    { hour: '06:00', userCount: 0, length: 0 },
    { hour: '07:00', userCount: 0, length: 0 },
    { hour: '08:00', userCount: 0, length: 0 },
    { hour: '09:00', userCount: 0, length: 0 },
    { hour: '10:00', userCount: 0, length: 0 },
    { hour: '11:00', userCount: 0, length: 0 },
    { hour: '12:00', userCount: 0, length: 0 },
    { hour: '13:00', userCount: 0, length: 0 },
    { hour: '14:00', userCount: 0, length: 0 },
    { hour: '15:00', userCount: 0, length: 0 },
    { hour: '16:00', userCount: 0, length: 0 },
    { hour: '17:00', userCount: 0, length: 0 },
    { hour: '18:00', userCount: 0, length: 0 },
    { hour: '19:00', userCount: 0, length: 0 },
    { hour: '20:00', userCount: 0, length: 0 },
    { hour: '21:00', userCount: 0, length: 0 },
    { hour: '22:00', userCount: 0, length: 0 },
    { hour: '23:00', userCount: 0, length: 0 },
    { hour: '24:00', userCount: 0, length: 0 }
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
    const countArr = await requestUserCountAndLength({ dateStr });
    this.line_data = this.line_data.map((item, index) => ({
      hour: item.hour,
      userCount: countArr[index].userCount,
      length: countArr[index].length
    }));
  }
}

export default HomeStore;
