const production = {
  // 生产环境服务器地址
  // origin: 'https://production.easy-mock.com'
  origin: 'http://10.58.4.3:9510'
  // origin: 'http://10.58.4.37:20001'
}
const develop = {
  // 开发/测试 环境服务器地址
  // origin: 'https://www.easy-mock.com'
  origin: 'http://10.58.4.3:9510'
  // origin: 'http://10.58.4.37:20001'
}

const port = 8019;
// export { production, develop }
module.exports = { production, develop, port };