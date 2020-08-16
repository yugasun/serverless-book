// 通过 dotenv 模块注入 .env 环境变量
require('dotenv').config();

const Express = require('express');
// 引入数据库操作对象
const DB = require('./db');
const app = Express();
const isDev = process.env.NODE_ENV === 'dev';

app.use(Express.json());

app.get('/', (req, res) => {
  res.send({
    msg: 'Hello Serverless',
  });
});

/**
 * 获取用户列表
 */
app.get('/users', async (req, res) => {
  const data = await DB.getUsers();
  res.send(data);
});

/**
 * 创建用户
 */
app.post('/users', async (req, res) => {
  const user = req.body;
  const data = await DB.createUser(user);
  res.send({
    id: data.insertId,
    message: 'Create success',
  });
});

/**
 * 获取指定 id 用户详情
 */
app.get('/users/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const [data] = await DB.getUser(id);
  if (data) {
    res.send(data);
  } else {
    res.send({
      id,
      message: 'User not exist',
    });
  }
});

/**
 * 更新用户
 */
app.put('/users/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const user = req.body;
  await DB.updateUser(id, user);
  res.send({
    id,
    message: 'Update succes',
  });
});

/**
 * 删除用户
 */
app.delete('/users/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  await DB.deleteUser(id);
  res.send({
    id,
    message: 'Delete success',
  });
});

// 如果是本地开发，则通过端口监听方式启动服务
if (isDev) {
  app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
  });
}
// 通关 tencent-serverless-http 库转换成云上可执行的云函数
const { createServer, proxy } = require('tencent-serverless-http');
module.exports.main_handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const server = createServer(app);
  const result = await proxy(server, event, context, 'PROMISE').promise;
  return result;
};
