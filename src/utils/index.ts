import { config } from '@/config';

export * from './storage_utils';
export * from './locationToDistance';
export * from './findOperationAera';

export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //不含最大值，含最小值
}

export const getApp = () => {
  console.log(window.tcb);
  const app = window.tcb.init({
    env: config.envId
  });

  const auth = app.auth({
    persistence: 'local'
  });

  async function login() {
    await auth.anonymousAuthProvider().signIn();
    // 匿名登录成功检测登录状态isAnonymous字段为true
    // const loginState = await auth.getLoginState()
  }
  login();

  return app;
};
