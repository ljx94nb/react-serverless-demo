/* eslint-disable */
const tcb = require('tcb-admin-node');
// 初始化环境
const app = tcb.init({
  env: 'my-serverless-2gk2td9k79b09fc4'
});
// 获取数据引用
const db = app.database();
exports.main = async (event, context) => {
  const { district } = event;
  // 使用 where 方法查询 name 为 test 数据
  // 链式调用 get 方法，执行查询过程并返回数据
  let result = await db
    .collection('bike')
    .where({
      start_location: {
        addressComponent: {
          district
        }
      }
    })
    .get();

  let result2 = await db
    .collection('bike')
    .where({
      end_location: {
        addressComponent: {
          district
        }
      }
    })
    .get();

  return [...result.data, ...result2.data];
};
