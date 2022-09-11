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

/************************************** authenticate */

describe("authenticate", function () {
  test("works", async function () {
    const trainer = await Trainer.authenticate({ email: "t1@email.com", password: "password1" });

    expect(trainer).toEqual({
      id: expect.any(Number),
      firstName: "T1F",
      lastName: "T1L",
      email: "t1@email.com",
      isAdmin: false,
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
