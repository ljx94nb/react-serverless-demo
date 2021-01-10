import { observable, action } from 'mobx'

class GlobalConfigStore {
  @observable
  globalTheme = 'light'

  @action
  setGlobalTheme() {
    this.globalTheme = 'dark'
  }
}

export default GlobalConfigStore
