import { config } from '@/config'

export * from './storage_utils'
export const getApp = () => {
  console.log(window.tcb)
  const app = window.tcb.init({
    env: config.envId
  })

  const auth = app.auth({
    persistence: 'local'
  })

  async function login() {
    await auth.anonymousAuthProvider().signIn()
    // 匿名登录成功检测登录状态isAnonymous字段为true
    // const loginState = await auth.getLoginState()
  }
  login()

  return app
}
