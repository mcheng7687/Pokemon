"use strict";

const db = require("../db.js");
const { NotFoundError } = require("../expressError");
const Pokemon = require("./pokemon");
const { POKEMON_LIMIT, reqHungerToEvolve } = require("../config");
const { commonBeforeAll, commonAfterAll, commonBeforeEach, commonAfterEach } = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** get specific Pokemon */

describe("get Pokemon", function () {
  test("get by id", async function () {
    let pokemonSpecies = await Pokemon.get({ id: 1 });

    expect(pokemonSpecies.length).toEqual(3);
    expect(pokemonSpecies[0]).toEqual({
      id: 1,
      name: "Bulbasaur",
      image_url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/1.png",
      species: 1,
      prev_id: null,
      type: [
        "poison",
        "grass"
      ],
      color: [
        "green",
        "green"
      ]
    });

    let pokemonSpecies2 = await Pokemon.get({ id: 3 });

    expect(pokemonSpecies2.length).toEqual(3);
    expect(pokemonSpecies2).toEqual(pokemonSpecies);
  });

  test("get by name", async function () {
    let pokemonSpecies = await Pokemon.get({ name: "Bulbasaur" });

    expect(pokemonSpecies.length).toEqual(3);
    expect(pokemonSpecies[0]).toEqual({
      id: 1,
      name: "Bulbasaur",
      image_url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/1.png",
      species: 1,
      prev_id: null,
      type: [
        "poison",
        "grass"
      ],
      color: [
        "green",
        "green"
      ]
    });

    let pokemonSpecies2 = await Pokemon.get({ name: "Venusaur" });

    expect(pokemonSpecies2.length).toEqual(3);
    expect(pokemonSpecies2).toEqual(pokemonSpecies);
  });

  test("not found request", async function () {
    try {
      await Pokemon.get({ id: POKEMON_LIMIT + 1 });
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** get all Pokemon */

describe("all", function () {
  test("works: all", async function () {
    let pokemon = await Pokemon.all();

    expect(pokemon.length).toEqual(POKEMON_LIMIT);
    expect(pokemon[0].name).toEqual("Bulbasaur");
    expect(pokemon[3].name).toEqual("Charmander");
  });
});

/************************************** feed Trainer's Pokemon */

describe("feed Pokemon", function () {
  test("works: feed", async function () {
    const id = await db.query(`
      SELECT id
      FROM trainer_pokemon
      ORDER BY id
      `);

    let pokemon = await Pokemon.feed(1, id.rows[0].id)

    expect(pokemon.hunger).toEqual(1);

    pokemon = await Pokemon.feed(1, id.rows[0].id)

    expect(pokemon.hunger).toEqual(2);
  });

  test("works: evolve", async function () {
    const id = await db.query(`
      SELECT id
      FROM trainer_pokemon
      ORDER BY id
      `);

    let pokemon;

    for (let i = 1; i <= reqHungerToEvolve; i++) {
      pokemon = await Pokemon.feed(2, id.rows[1].id)
    }

    expect(pokemon.hunger).toEqual(0);
    expect(pokemon.pokemonId).toEqual(5);
  });

  test("not found to feed", async function () {
    try {
      await Pokemon.feed(1, 0);
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});