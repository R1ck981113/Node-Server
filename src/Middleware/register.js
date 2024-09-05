const sqlite3 = require('sqlite3').verbose();//verbose() 方法用于启用详细模式，它会提供更多的调试信息。当你在创建数据库连接时调用
const bcrypt = require('bcryptjs');

module.exports.registerUser = (req, res) => {
  console.log('registerUser');
  const db = new sqlite3.Database('./src/database.sqlite', (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Database connection failed');
      return;
    } else {
      console.log('Connected to the SQLite database.');
    }
  });

  db.serialize(() => {
    // 创建用户表，如果不存在
    db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT)');
  });

  const { username, password } = req.body;
  // 输入验证
  if (!username || !password) {
    return res.status(400).send('Username and password are required');
  }

  // 检查用户名是否已存在
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Error checking username');
      return;
    }
    if (row) {
      res.status(400).send('Username already exists');
      return;
    }

    // 密码哈希
    bcrypt.hash(password, 10, (err, hash) => { //其中数字10是盐的圆数
      if (err) {
        console.error(err.message);
        res.status(500).send('Error hashing password');
        return;
      }

      // 插入用户记录
      const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
      stmt.run(username, hash, function (err) {
        stmt.finalize();

        if (err) {
          console.error(err.message);
          res.status(500).send('Error registering user');
        } else {
          res.status(201).send({ username: username, message: 'User registered successfully' });
        }
      });
    });
  });

  // db.close();
};

module.exports.loginUser = (req, res) => {
  const db = new sqlite3.Database('./src/database.sqlite', (err) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Database connection failed');
      return;
    } else {
      console.log('Connected to the SQLite database.');
    }
  });

  const { username, password } = req.body;

  // 验证输入
  if (!username || !password) {
    return res.status(400).send('Username and password are required');
  }

  // 从数据库中查找用户
  const stmt = db.prepare('SELECT password FROM users WHERE username = ?');
  stmt.get(username, (err, row) => {
    stmt.finalize();

    if (err) {
      console.error(err.message);
      return res.status(500).send('Error fetching user');
    }

    if (row) {
      // 用户存在，比较密码
      bcrypt.compare(password, row.password, (err, result) => {
        if (result) {
          // 密码匹配，登录成功
          res.status(200).send('Login successful');
        } else {
          // 密码不匹配，登录失败
          res.status(401).send('Invalid username or password');
        }
      });
    } else {
      // 用户不存在
      res.status(401).send('Invalid username or password');
    }
  });

  db.close();
};