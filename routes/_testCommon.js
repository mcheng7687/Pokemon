"use strict";

const db = require("../db.js");
const Trainer = require("../models/trainer");
const { createToken } = require("../helpers/tokens");
let t1, t2, t3;
let p1, p2, p3;

async function commonBeforeAll() {
  await db.query("DELETE FROM trainer");

  await Trainer.register({
    firstName: "T1F",
    lastName: "T1L",
    email: "t1@pokemon.com",
    password: "password1",
  });
  await Trainer.register({
    firstName: "T2F",
    lastName: "T2L",
    email: "t2@pokemon.com",
    password: "password2",
  });
  await Trainer.register({
    firstName: "T3F",
    lastName: "T3L",
    email: "t3@pokemon.com",
    password: "password3",
  });

  await setTrainers();

  await Trainer.addNewPokemon(t1.id, 1);
  await Trainer.addNewPokemon(t2.id, 4);
  await Trainer.addNewPokemon(t3.id, 7);

  await setMyPokemon();
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

async function setTrainers() {
  const trainers = await db.query(`
    SELECT id, first_name AS "firstName", last_name AS "lastName", email, isAdmin
    FROM trainer
    ORDER BY id
  `);

  [t1, t2, t3] = trainers.rows;
  t1.token = await createToken(t1);
  t2.token = await createToken(t2);
  t3.token = await createToken(t3);
}

async function setMyPokemon() {
  const myPokemon = await db.query(`
    SELECT id, pokemon_id AS "pokemonId"
    FROM trainer_pokemon 
    ORDER BY trainer_id`);

  [p1, p2, p3] = myPokemon.rows;
}

async function getTrainers() {
  return { t1, t2, t3 };
}

async function getMyPokemon() {
  return { p1, p2, p3 };
}

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  getTrainers,
  getMyPokemon,
};
