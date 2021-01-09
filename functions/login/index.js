/* eslint-disable */
const tcb = require('tcb-admin-node')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
// 初始化环境
const app = tcb.init({
  env: 'my-serverless-2gk2td9k79b09fc4'
})
// 获取数据引用
const db = app.database()
exports.main = async (event, context) => {
  const { username, password } = event
  // 使用 where 方法查询 name 为 test 数据
  // 链式调用 get 方法，执行查询过程并返回数据
  let result = await db
    .collection('user')
    .where({
      username
    })
    // .limit(2)
    .get()
  if (result.data.length) {
    const user = result.data[0]
    if (bcrypt.compareSync(password, user.password)) {
      // 设置token，注意token的value是一个json对象，而且里面不要包含敏感信息！！
      const value = { id: user._id, username: user.username, identity: user.identity }
      const token = jwt.sign(value, 'secret', { expiresIn: 60 * 60 }) // 过期时间3600秒之后，secret为key
      user['token'] = 'Bearer ' + token
    } else {
      return {
        message: '密码错误!'
      }
    }
  } else {
    return {
      message: '账户不存在!'
    }
  }
  // 获取返回的数据结果
  return result.data
}
