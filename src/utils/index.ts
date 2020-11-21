import { config } from '@/config'

export const getApp = () => {
  const app = window.tcb.init({
    env: config.envId
  })

  const auth = app.auth({
    persistence: 'local'
  })

  async function login() {
    await auth.anonymousAuthProvider().signIn()
    // 匿名登录成功检测登录状态isAnonymous字段为true
    const loginState = await auth.getLoginState()
    console.log(loginState.isAnonymousAuth) // true
  }
  login()

  return app
}
