/* eslint-disable */
const tcb = require('tcb-admin-node')
// 初始化环境
const app = tcb.init({
  env: 'my-serverless-2gk2td9k79b09fc4'
})
// 获取数据引用
const db = app.database()
exports.main = async (event, context) => {
  const { bikeid } = event
  // 使用 where 方法查询 name 为 test 数据
  // 链式调用 get 方法，执行查询过程并返回数据
  let result = await db
    .collection('bike')
    .where({
      bikeid
    })
    // .limit(2)
    .get()
  // 获取返回的数据结果
  return result.data
}
