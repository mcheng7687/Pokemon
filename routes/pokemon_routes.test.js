"use strict";

const request = require("supertest");

const app = require("../app");
const { POKEMON_LIMIT } = require("../config.js");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** GET /pokemon/get */

describe("GET /pokemon/get", function () {
  test("works: get all Pokemon", async function () {
    const resp = await request(app)
      .get("/pokemon/get");

    expect(resp.statusCode).toEqual(200);
    expect(resp.body.length).toEqual(POKEMON_LIMIT);
  });
});

/************************************** GET /pokemon/get?[id] */

describe("GET /pokemon/get", function () {
  test("works: get Pokemon species using pokemon id", async function () {
    const resp = await request(app)
      .get("/pokemon/get?id=1");

    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual([{
      color: ["green", "green"],
      id: 1,
      image_url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/1.png",
      name: "Bulbasaur",
      prev_id: null,
      species: 1,
      type: ["poison", "grass"]
    }, {
      color: ["green", "green"],
      id: 2,
      image_url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/2.png",
      name: "Ivysaur",
      prev_id: 1,
      species: 1,
      type: ["poison", "grass"]
    }, {
      color: ["green", "green"],
      id: 3,
      image_url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/3.png",
      name: "Venusaur",
      prev_id: 2,
      species: 1,
      type: ["poison", "grass"]
    }]);
  });

  test("bad request if pokemod id is incorrect", async function () {
    const resp = await request(app)
      .get(`/pokemon/get?id=${POKEMON_LIMIT + 1}`);

    expect(resp.statusCode).toEqual(404);
  });
});

/************************************** GET /pokemon/get?[name] */

describe("GET /pokemon/get", function () {
  test("works: get Pokemon species using name", async function () {
    const resp = await request(app)
      .get("/pokemon/get?name=Blastoise");

    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual([{
      color: ["blue"],
      id: 7,
      image_url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/7.png",
      name: "Squirtle",
      prev_id: null,
      species: 3,
      type: ["water"]
    }, {
      color: ["blue"],
      id: 8,
      image_url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/8.png",
      name: "Wartortle",
      prev_id: 7,
      species: 3,
      type: ["water"]
    }, {
      color: ["blue"],
      id: 9,
      image_url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/9.png",
      name: "Blastoise",
      prev_id: 8,
      species: 3,
      type: ["water"]
    }]);
  });

  test("bad request if pokemod name is incorrect", async function () {
    const resp = await request(app)
      .get(`/pokemon/get?name=abcdefghijklmnopqrstuvwxyz`);

    expect(resp.statusCode).toEqual(404);
  });
});