const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

async function commonBeforeAll() {
  await db.query("DELETE FROM trainer")

  const trainers = await db.query(`
    INSERT INTO trainer (id, email, password, first_name, last_name)
    VALUES  (1, 't1@email.com', $1, 'T1F', 'T1L'),
            (2, 't2@email.com', $2, 'T2F', 'T2L'),
            (3, 't3@email.com', $3, 'T3F', 'T3L')
    RETURNING id
    `, [
    await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
    await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
    await bcrypt.hash("password3", BCRYPT_WORK_FACTOR),
  ]);

  const pokemon = await db.query(`
    INSERT INTO trainer_pokemon (id, trainer_id, pokemon_id)
    VALUES  (1, $1, 1),
            (2, $2, 4),
            (3, $3, 7)
    RETURNING id
  `, [
    trainers.rows[0].id,
    trainers.rows[1].id,
    trainers.rows[2].id,
  ]);

}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
};