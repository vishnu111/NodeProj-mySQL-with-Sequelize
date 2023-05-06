/** communicating with SQL database with sequelize */
// const mysql = require("mysql2");

// //creating sql connection pool
// const pool = mysql.createPool({
//   host: "127.0.0.1",
//   user: "root",
//   database: "node-complete",
//   password: "Dream@007",
// });
// module.exports = pool.promise();

const Sequelize = require("sequelize");

const sequelize = new Sequelize("node-complete", "root", "Dream@007", {
  dialect: "mysql",
  host: "127.0.0.1",
});
module.exports = sequelize;
