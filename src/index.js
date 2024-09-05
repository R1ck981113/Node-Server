const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const register = require('./Middleware/register'); // 引入注册模块

const app = express();
// 用于解析 JSON 格式的请求体
app.use(express.json());
// 用于解析 URL 编码格式的请求体
app.use(express.urlencoded({ extended: true }));

app.listen(3050, () => {
    console.log(`Server is running on port ${3050}`);
  });


app.get('*', (req, res, next) => {
  switch (req.path) {
    case '/routeA':
      handleRouteA(req, res);
      break;
    case '/routeB':
      handleRouteB(req, res);
      break;
    case '/routeC':
      handleRouteC(req, res);
      break;
    default:
      handleDefault(req, res);
      break;
  }
});


app.post('*', (req, res, next) => {
  switch (req.path) {
    case '/register':
      register.registerUser(req, res);
      break;
    case '/routeB':
      handleRouteB(req, res);
      break;
    case '/routeC':
      handleRouteC(req, res);
      break;
    default:
      handleDefault(req, res);
      break;
  }
});

