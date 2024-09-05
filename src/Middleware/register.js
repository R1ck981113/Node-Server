const sqlite3 = require('sqlite3').verbose();

module.exports.registerUser = (req,res) =>
{
    console.log('registerUser');
    const db = new sqlite3.Database('./src/database.sqlite', (err) => {
        if (err) {
          console.error(err.message);
        } else {
          console.log('Connected to the SQLite database.');
        }
      });
    
    db.serialize(() => {
      db.run('CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)');
      console.log('Table created');
    });
      const { username, password } = req.body;
      const obj = {
        'username':username,
        'passworf':password
      }
      res.status(201).send(obj);
}