const express = require('express');
// const sqlite3 = require('sqlite3').verbose();
const register = require('./Middleware/register'); // 引入注册模块
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // 引入fs模块
const cors = require('cors');

const app = express();
// 用于解析 JSON 格式的请求体
app.use(express.json());
// 用于解析 URL 编码格式的请求体
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.listen(3060, () => {
    console.log(`Server is running on port ${3050}`);
  });

const uploadDir = path.join(__dirname, 'img');
if (!fs.existsSync(uploadDir)){
  fs.mkdirSync(uploadDir);
}

console.warn(uploadDir);
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
    case '/login':
      register.loginUser(req, res);
      break;
    case '/upload':
      handleUpload(req, res);
      break;
    default:
      handleDefault(req, res);
      break;
  }
});

// 配置Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // 保存的路径
  },
  filename: function (req, file, cb) {
    // 生成文件名，这里使用原始文件名
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

const handleUpload = (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(500).send('文件上传失败');
    }
    res.send('文件上传成功');
  });
};