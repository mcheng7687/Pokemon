/** Database for pokemon */

const { DB_URI } = require("./config");

const pg = require("pg");

const db = new pg.Client(DB_URI);

db.connect();

module.exports = db;
