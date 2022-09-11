/** Database for pokemon */

const { DB_URI } = require("./config");

const pg = require("pg");

const db = new pg.Client({
  connectionString: DB_URI,
  ssl: {
    rejectUnauthorized: false
  }
});

db.connect();

module.exports = db;
