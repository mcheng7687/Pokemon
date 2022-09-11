const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

async function commonBeforeAll() {
  await db.query("DELETE FROM trainer");
  await db.query("DELETE FROM trainer_pokemon");

  const trainers = await db.query(`
    INSERT INTO trainer (email, password, first_name, last_name)
    VALUES  ('t1@email.com', $1, 'T1F', 'T1L'),
            ('t2@email.com', $2, 'T2F', 'T2L'),
            ('t3@email.com', $3, 'T3F', 'T3L')
    RETURNING id
    `, [
    await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
    await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
    await bcrypt.hash("password3", BCRYPT_WORK_FACTOR),
  ]);

  await db.query(`
    INSERT INTO trainer_pokemon (trainer_id, pokemon_id)
    VALUES  ($1, 1),
            ($2, 4),
            ($3, 7)
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