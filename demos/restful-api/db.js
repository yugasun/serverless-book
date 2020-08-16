const mysql = require('mysql2/promise');

const db = {
  connection: null,
  async init() {
    // 如果没有数据库连接，初始化
    if (!this.connection) {
      this.connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DBNAME,
      });

      // 初始化 users 表结构
      await this.connection.query(`
        CREATE TABLE IF NOT EXISTS users (
          id      INT             UNSIGNED AUTO_INCREMENT PRIMARY KEY,
          name    VARCHAR(30)     NOT NULL,
          age     INT             NOT NULL
        )ENGINE=InnoDB DEFAULT CHARSET=utf8;
      `);
    }
  },

  async query(sql, data) {
    await this.init();
    const res = await this.connection.query(sql, data);
    return res;
  },
  async getUsers() {
    const [rows, fields] = await this.query('SELECT * FROM `users`');
    return rows || [];
  },
  async getUser(id) {
    const [rows] = await this.query('SELECT * FROM `users` WHERE id = ?', [id]);
    return rows;
  },
  async createUser(user) {
    const [rows] = await this.query('INSERT INTO `users` SET ?', user);
    return rows;
  },
  async updateUser(id, user) {
    const res = await this.query(
      'UPDATE `users` SET name = ?, age = ? WHERE id = ?',
      [user.name, user.age, id],
    );
    return res;
  },
  async deleteUser(id) {
    const res = await this.query('DELETE FROM `users` WHERE id = ?', [id]);
    return res;
  },
};

module.exports = db;
