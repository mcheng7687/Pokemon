"use strict";

const db = require("../db.js");
const { NotFoundError, UnauthorizedError } = require("../expressError");
const Pokemon = require("./pokemon");
const Trainer = require("./trainer");
const { POKEMON_LIMIT } = require("../config");
const { commonBeforeAll, commonAfterAll, commonBeforeEach, commonAfterEach } = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** AUTHENTICATE */

describe("authenticate", function () {
  test("works", async function () {
    const trainer = await Trainer.authenticate({ email: "t1@email.com", password: "password1" });

    expect(trainer).toEqual({
      id: 1,
      firstName: "T1F",
      lastName: "T1L",
      email: "t1@email.com",
      isAdmin: false,
      password: expect.any(String)
    });
  });

  test("unauth if no such user", async function () {
    try {
      await Trainer.authenticate({ email: "wrong@email.com", password: "no_access" });
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("unauth if wrong password", async function () {
    try {
      await Trainer.authenticate({ email: "t1@email.com", password: "incorrect" });
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });
});

/************************************** GET trainer info */

describe("get", function () {
  test("works: get", async function () {
    const trainer_id = await db.query(`
      SELECT id
      FROM trainer
      ORDER BY id
    `);

    const trainer = await Trainer.get(trainer_id.rows[0].id);

    expect(trainer).toEqual({
      id: 1,
      firstName: "T1F",
      lastName: "T1L",
      email: "t1@email.com",
      isAdmin: false,
    });
  });

  test("not found", async function () {
    try {
      await Trainer.get(0);
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** UPDATE trainer info */

describe("update", function () {
  test("works: update", async function () {
    const trainer = await Trainer.update(1, { firstName: "F1T", lastName: "L1T", email: "new@email.com" });

    expect(trainer).toEqual({
      id: 1,
      firstName: "F1T",
      lastName: "L1T",
      email: "new@email.com",
      isAdmin: false,
    });
  });

  test("not found", async function () {
    try {
      await Trainer.update(0, { firstName: "F1T", lastName: "L1T", email: "new@email.com" });
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** DELETE trainer info */

describe("delete", function () {
  test("works: delete", async function () {
    await Trainer.remove(1);

    const trainer = await db.query(`
      SELECT id, email
      FROM trainer
      WHERE id = 1
    `);

    expect(trainer.rows.length).toEqual(0);

  });

  test("not found", async function () {
    try {
      await Trainer.remove(0);
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** ADD to trainer pokemon list */

describe("add pokemon to trainer", function () {
  test("works: add pokemon to trainer", async function () {
    await Trainer.addNewPokemon(2, 1);

    const trainersPokemon = await db.query(`
      SELECT id, trainer_id AS "trainerId", pokemon_id AS "pokemonId"
      FROM trainer_pokemon
      ORDER BY id
    `);

    expect(trainersPokemon.rows).toEqual([{
      id: 1,
      trainerId: 1,
      pokemonId: 1,
    }, {
      id: 2,
      trainerId: 2,
      pokemonId: 4,
    }, {
      id: 3,
      trainerId: 3,
      pokemonId: 7,
    }, {
      id: expect.any(Number),
      trainerId: 2,
      pokemonId: 1,
    }]);

  });

  test("pokemon id not found", async function () {
    try {
      await Trainer.addNewPokemon(1, 0);
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("trainer id not found", async function () {
    try {
      await Trainer.addNewPokemon(0, 2);
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** GET trainer pokemon list */

describe("get all pokemon of trainer", function () {
  test("works: get all pokemon of trainer", async function () {
    const pokemon = await Trainer.getMyPokemon(2);

    expect(pokemon).toEqual([{
      color: ["red"],
      hunger: 0,
      id: 4,
      image_url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/4.png",
      name: "Charmander",
      trainerPokemonId: 2,
      type: ["fire"]
    }]);

  });

  test("trainer id not found", async function () {
    try {
      await Trainer.getMyPokemon(0);
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** REMOVE pokemon from trainer pokemon list */

describe("remove pokemon of trainer", function () {
  test("works: remove pokemon of trainer", async function () {
    await Trainer.removeMyPokemon(2, 2);

    const pokemon = await db.query(`
      SELECT id, trainer_id AS "trainerId", pokemon_id AS "pokemonId"
      FROM trainer_pokemon
      WHERE id=2
    `);

    expect(pokemon.rows.length).toEqual(0);

  });

  test("trainer pokemon id not found", async function () {
    try {
      await Trainer.removeMyPokemon(1, 0);
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});