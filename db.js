/** Database for pokemon */

const { DB_URI } = require("./config");

const pg = require("pg");

let db;

if (process.env.NODE_ENV === "production") {
  db = new pg.Client({
    connectionString: DB_URI,
    ssl: {
      rejectUnauthorized: false
    }
  });
} else {
  db = new pg.Client({
    connectionString: DB_URI
  });
}

db.connect();

module.exports = db;
