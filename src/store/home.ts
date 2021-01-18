import { observable, action } from 'mobx';
import { requestBikeData, requestAddress } from '@/api';

class HomeStore {
  @observable
  home = 0;
  str = '首页';
  bike_data = [];

  @action
  add() {
    this.home += 1;
  }

  @action
  less() {
    this.home -= 1;
  }

  @action
  async getBikeData(currPage: number, pageSize: number) {
    try {
      const data = await requestBikeData(currPage, pageSize);
      for (const item of data) {
        item['start_time_num'] = new Date(item.start_time).getTime();
        item['end_time_num'] = new Date(item.end_time).getTime();
        console.log(
          await requestAddress({ location: item.start_location_y + ',' + item.start_location_x })
        );
        item['start_location'] = '';
        item['end_location'] = '';
      }
      this.bike_data = data;
    } catch (error) {
      throw error;
    }
  }
}

export default HomeStore;
