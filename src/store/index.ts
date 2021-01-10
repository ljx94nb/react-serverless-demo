import HomeStore from './home';
import GlobalConfigStore from './global_config';

let homeStore = new HomeStore();
let globalConfigStore = new GlobalConfigStore();

const stores = {
  homeStore,
  globalConfigStore
};

export default stores;
