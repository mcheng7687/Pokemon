"use strict";

const request = require("supertest");

const app = require("../app");
const { reqHungerToEvolve } = require("../config.js");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  getTrainers,
  getMyPokemon,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /trainer/register */

describe("POST /trainer/register", function () {
  test("works: create new trainer", async function () {
    const resp = await request(app)
      .post("/trainer/register")
      .send({
        firstName: "First",
        lastName: "Last",
        password: "password",
        email: "new@email.com",
      });

    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      id: expect.any(Number),
      firstName: "First",
      lastName: "Last",
      email: "new@email.com",
      isAdmin: false,
      token: expect.any(String),
    });
  });

  test("bad request if duplicate email used", async function () {
    const resp = await request(app)
      .post("/trainer/register")
      .send({
        firstName: "Copy",
        lastName: "Cat",
        password: "copiedpassword",
        email: "t1@pokemon.com",
      });

    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** POST /trainer/login */

describe("POST /trainer/login", function () {
  test("works: login existing trainer", async function () {
    const resp = await request(app)
      .post("/trainer/login")
      .send({
        email: "t1@pokemon.com",
        password: "password1",
      });

    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      id: expect.any(Number),
      firstName: "T1F",
      lastName: "T1L",
      email: "t1@pokemon.com",
      password: expect.any(String),
      isAdmin: false,
      token: expect.any(String),
    });
  });

  test("bad request if email is incorrect", async function () {
    const resp = await request(app)
      .post("/trainer/login")
      .send({
        email: "t10@pokemon.com",
        password: "password1",
      });

    expect(resp.statusCode).toEqual(404);
  });

  test("bad request if email/password combination is incorrect", async function () {
    const resp = await request(app)
      .post("/trainer/login")
      .send({
        email: "t1@pokemon.com",
        password: "wrongpassword",
      });

    expect(resp.statusCode).toEqual(401);
  });
});

/************************************** GET /trainer?[id] */

describe("GET /trainer?[id]", function () {
  test("works: get trainer info", async function () {
    const { t1 } = await getTrainers();

    const resp = await request(app)
      .get(`/trainer?id=${t1.id}`)
      .set("Authorization", `Bearer ${t1.token}`);

    expect(resp.statusCode).toEqual(200);
    expect(resp.body.trainer).toEqual({
      id: expect.any(Number),
      firstName: "T1F",
      lastName: "T1L",
      email: "t1@pokemon.com",
      isAdmin: false,
    });
  });

  test("bad request if id is incorrect", async function () {
    const { t1, t2, } = await getTrainers();

    const resp = await request(app)
      .get(`/trainer?id=${t1.id}`)
      .set("Authorization", `Bearer ${t2.token}`);

    expect(resp.statusCode).toEqual(401);
  });
});

/************************************** PATCH /trainer?[id] */

describe("PATCH /trainer?[id]", function () {
  test("works: get trainer info", async function () {
    const { t1 } = await getTrainers();

    const resp = await request(app)
      .patch(`/trainer?id=${t1.id}`)
      .send({
        firstName: "F1T",
        lastName: "L1T",
        email: "new@pokemon.com",
      })
      .set("Authorization", `Bearer ${t1.token}`);

    expect(resp.statusCode).toEqual(200);
    expect(resp.body.trainer).toEqual({
      id: expect.any(Number),
      firstName: "F1T",
      lastName: "L1T",
      email: "new@pokemon.com",
      isAdmin: false,
    });
  });

  test("bad request if id is incorrect", async function () {
    const { t1, t2, } = await getTrainers();

    const resp = await request(app)
      .patch(`/trainer?id=${t1.id}`)
      .send({
        firstName: "F1T",
        lastName: "L1T",
        email: "new@pokemon.com",
      })
      .set("Authorization", `Bearer ${t2.token}`);

    expect(resp.statusCode).toEqual(401);
  });
});

/************************************** DELETE /trainer?[id] */

describe("DELETE /trainer?[id]", function () {
  test("works: delete trainer", async function () {
    const { t1 } = await getTrainers();

    const resp = await request(app)
      .delete(`/trainer?id=${t1.id}`)
      .set("Authorization", `Bearer ${t1.token}`);

    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({
      message: `${t1.email} removed`,
    });
  });

  test("bad request if id is incorrect", async function () {
    const { t1, t2, } = await getTrainers();

    const resp = await request(app)
      .delete(`/trainer?id=${t1.id}`)
      .set("Authorization", `Bearer ${t2.token}`);

    expect(resp.statusCode).toEqual(401);
  });
});

/************************************** GET /trainer/myPokemon?[id] */

describe("GET /trainer/myPokemon?[id]", function () {
  test("works: get trainer pokemon list", async function () {
    const { t3 } = await getTrainers();

    const resp = await request(app)
      .get(`/trainer/myPokemon?id=${t3.id}`)
      .set("Authorization", `Bearer ${t3.token}`);

    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual([{
      id: 7,
      name: "Squirtle",
      color: ["blue"],
      hunger: 0,
      image_url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/7.png",
      trainerPokemonId: expect.any(Number),
      type: ["water"],
    }]);
  });

  test("bad request if id is incorrect", async function () {
    const { t1, t2, } = await getTrainers();

    const resp = await request(app)
      .get(`/trainer/myPokemon?id=${t1.id}`)
      .set("Authorization", `Bearer ${t2.token}`);

    expect(resp.statusCode).toEqual(401);
  });
});

/************************************** POST /trainer/myPokemon/add?[id][pokemonId] */

describe("POST /trainer/myPokemon/add?[id][pokemonId]", function () {
  test("works: add pokemon to trainer pokemon list", async function () {
    const { t2 } = await getTrainers();

    const resp = await request(app)
      .post(`/trainer/myPokemon/add?id=${t2.id}&pokemonId=10`)
      .set("Authorization", `Bearer ${t2.token}`);

    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({
      id: expect.any(Number),
    });
  });

  test("bad request if id is incorrect", async function () {
    const { t1, t2, } = await getTrainers();

    const resp = await request(app)
      .post(`/trainer/myPokemon/add?id=${t1.id}&pokemonId=10`)
      .set("Authorization", `Bearer ${t2.token}`);

    expect(resp.statusCode).toEqual(401);
  });

  test("bad request if pokemonId is incorrect", async function () {
    const { t2, } = await getTrainers();

    const resp = await request(app)
      .post(`/trainer/myPokemon/add?id=${t2.id}&pokemonId=0`)
      .set("Authorization", `Bearer ${t2.token}`);

    expect(resp.statusCode).toEqual(404);
  });
});

/************************************** POST /trainer/myPokemon/feed?[id][myPokemonId] */

describe("POST /trainer/myPokemon/feed?[id][myPokemonId]", function () {
  test("works: feed pokemon", async function () {
    const { t2 } = await getTrainers();
    const { p2 } = await getMyPokemon();

    const resp = await request(app)
      .post(`/trainer/myPokemon/feed?id=${t2.id}&myPokemonId=${p2.id}`)
      .set("Authorization", `Bearer ${t2.token}`);

    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({
      id: expect.any(Number),
      pokemonId: p2.pokemonId,
      hunger: expect.any(Number),
    });
  });

  test("works: feed to evolve pokemon", async function () {
    const { t2 } = await getTrainers();
    const { p2 } = await getMyPokemon();

    let resp;

    for (let i = 1; i <= reqHungerToEvolve; i++) {
      resp = await request(app)
        .post(`/trainer/myPokemon/feed?id=${t2.id}&myPokemonId=${p2.id}`)
        .set("Authorization", `Bearer ${t2.token}`);
    }

    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({
      id: expect.any(Number),
      pokemonId: p2.pokemonId + 1,
      hunger: expect.any(Number),
    });
  });

  test("bad request if id is incorrect", async function () {
    const { t1, t2, } = await getTrainers();
    const { p2 } = await getMyPokemon();

    const resp = await request(app)
      .post(`/trainer/myPokemon/feed?id=${t1.id}&myPokemonId=${p2.id}`)
      .set("Authorization", `Bearer ${t2.token}`);

    expect(resp.statusCode).toEqual(401);
  });

  test("bad request if pokemonId is incorrect", async function () {
    const { t2, } = await getTrainers();
    const { p1 } = await getMyPokemon();

    const resp = await request(app)
      .post(`/trainer/myPokemon/feed?id=${t2.id}&myPokemonId=${p1.id}`)
      .set("Authorization", `Bearer ${t2.token}`);

    expect(resp.statusCode).toEqual(404);
  });
});

/************************************** POST /trainer/myPokemon/release?[id][myPokemonId] */

describe("POST /trainer/myPokemon/release?[id][myPokemonId]", function () {
  test("works: release pokemon", async function () {
    const { t2 } = await getTrainers();
    const { p2 } = await getMyPokemon();

    const resp = await request(app)
      .post(`/trainer/myPokemon/release?id=${t2.id}&myPokemonId=${p2.id}`)
      .set("Authorization", `Bearer ${t2.token}`);

    expect(resp.statusCode).toEqual(200);
    expect(resp.body).toEqual({
      id: expect.any(Number),
      pokemonId: p2.pokemonId,
      trainerId: t2.id,
    });
  });

  test("bad request if id is incorrect", async function () {
    const { t1, t2, } = await getTrainers();
    const { p2 } = await getMyPokemon();

    const resp = await request(app)
      .post(`/trainer/myPokemon/release?id=${t1.id}&myPokemonId=${p2.id}`)
      .set("Authorization", `Bearer ${t2.token}`);

    expect(resp.statusCode).toEqual(401);
  });

  test("bad request if pokemonId is incorrect", async function () {
    const { t2, } = await getTrainers();
    const { p3 } = await getMyPokemon();

    const resp = await request(app)
      .post(`/trainer/myPokemon/release?id=${t2.id}&myPokemonId=${p3.id}`)
      .set("Authorization", `Bearer ${t2.token}`);

    expect(resp.statusCode).toEqual(404);
  });
});

/************************************** POST /users */

// describe("POST /users", function () {
//   test("works for admins: create non-admin", async function () {
//     const resp = await request(app)
//       .post("/users")
//       .send({
//         username: "u-new",
//         firstName: "First-new",
//         lastName: "Last-newL",
//         password: "password-new",
//         email: "new@email.com",
//         isAdmin: false,
//       })
//       .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.statusCode).toEqual(201);
//     expect(resp.body).toEqual({
//       user: {
//         username: "u-new",
//         firstName: "First-new",
//         lastName: "Last-newL",
//         email: "new@email.com",
//         isAdmin: false,
//       }, token: expect.any(String),
//     });
//   });

//   test("works for admins: create admin", async function () {
//     const resp = await request(app)
//       .post("/users")
//       .send({
//         username: "u-new",
//         firstName: "First-new",
//         lastName: "Last-newL",
//         password: "password-new",
//         email: "new@email.com",
//         isAdmin: true,
//       })
//       .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.statusCode).toEqual(201);
//     expect(resp.body).toEqual({
//       user: {
//         username: "u-new",
//         firstName: "First-new",
//         lastName: "Last-newL",
//         email: "new@email.com",
//         isAdmin: true,
//       }, token: expect.any(String),
//     });
//   });

//   test("unauth for users", async function () {
//     const resp = await request(app)
//       .post("/users")
//       .send({
//         username: "u-new",
//         firstName: "First-new",
//         lastName: "Last-newL",
//         password: "password-new",
//         email: "new@email.com",
//         isAdmin: true,
//       })
//       .set("authorization", `Bearer ${u1Token}`);
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("unauth for anon", async function () {
//     const resp = await request(app)
//       .post("/users")
//       .send({
//         username: "u-new",
//         firstName: "First-new",
//         lastName: "Last-newL",
//         password: "password-new",
//         email: "new@email.com",
//         isAdmin: true,
//       });
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("bad request if missing data", async function () {
//     const resp = await request(app)
//       .post("/users")
//       .send({
//         username: "u-new",
//       })
//       .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.statusCode).toEqual(400);
//   });

//   test("bad request if invalid data", async function () {
//     const resp = await request(app)
//       .post("/users")
//       .send({
//         username: "u-new",
//         firstName: "First-new",
//         lastName: "Last-newL",
//         password: "password-new",
//         email: "not-an-email",
//         isAdmin: true,
//       })
//       .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.statusCode).toEqual(400);
//   });
// });

// /************************************** GET /users */

// describe("GET /users", function () {
//   test("works for admins", async function () {
//     const resp = await request(app)
//       .get("/users")
//       .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.body).toEqual({
//       users: [
//         {
//           username: "u1",
//           firstName: "U1F",
//           lastName: "U1L",
//           email: "user1@user.com",
//           isAdmin: false,
//         },
//         {
//           username: "u2",
//           firstName: "U2F",
//           lastName: "U2L",
//           email: "user2@user.com",
//           isAdmin: false,
//         },
//         {
//           username: "u3",
//           firstName: "U3F",
//           lastName: "U3L",
//           email: "user3@user.com",
//           isAdmin: false,
//         },
//       ],
//     });
//   });

//   test("unauth for non-admin users", async function () {
//     const resp = await request(app)
//       .get("/users")
//       .set("authorization", `Bearer ${u1Token}`);
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("unauth for anon", async function () {
//     const resp = await request(app)
//       .get("/users");
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("fails: test next() handler", async function () {
//     // there's no normal failure event which will cause this route to fail ---
//     // thus making it hard to test that the error-handler works with it. This
//     // should cause an error, all right :)
//     await db.query("DROP TABLE users CASCADE");
//     const resp = await request(app)
//       .get("/users")
//       .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.statusCode).toEqual(500);
//   });
// });

// /************************************** GET /users/:username */

// describe("GET /users/:username", function () {
//   test("works for admin", async function () {
//     const resp = await request(app)
//       .get(`/users/u1`)
//       .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.body).toEqual({
//       user: {
//         username: "u1",
//         firstName: "U1F",
//         lastName: "U1L",
//         email: "user1@user.com",
//         isAdmin: false,
//         applications: [testJobIds[0]],
//       },
//     });
//   });

//   test("works for same user", async function () {
//     const resp = await request(app)
//       .get(`/users/u1`)
//       .set("authorization", `Bearer ${u1Token}`);
//     expect(resp.body).toEqual({
//       user: {
//         username: "u1",
//         firstName: "U1F",
//         lastName: "U1L",
//         email: "user1@user.com",
//         isAdmin: false,
//         applications: [testJobIds[0]],
//       },
//     });
//   });

//   test("unauth for other users", async function () {
//     const resp = await request(app)
//       .get(`/users/u1`)
//       .set("authorization", `Bearer ${u2Token}`);
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("unauth for anon", async function () {
//     const resp = await request(app)
//       .get(`/users/u1`);
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("not found if user not found", async function () {
//     const resp = await request(app)
//       .get(`/users/nope`)
//       .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.statusCode).toEqual(404);
//   });
// });

// /************************************** PATCH /users/:username */

// describe("PATCH /users/:username", () => {
//   test("works for admins", async function () {
//     const resp = await request(app)
//       .patch(`/users/u1`)
//       .send({
//         firstName: "New",
//       })
//       .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.body).toEqual({
//       user: {
//         username: "u1",
//         firstName: "New",
//         lastName: "U1L",
//         email: "user1@user.com",
//         isAdmin: false,
//       },
//     });
//   });

//   test("works for same user", async function () {
//     const resp = await request(app)
//       .patch(`/users/u1`)
//       .send({
//         firstName: "New",
//       })
//       .set("authorization", `Bearer ${u1Token}`);
//     expect(resp.body).toEqual({
//       user: {
//         username: "u1",
//         firstName: "New",
//         lastName: "U1L",
//         email: "user1@user.com",
//         isAdmin: false,
//       },
//     });
//   });

//   test("unauth if not same user", async function () {
//     const resp = await request(app)
//       .patch(`/users/u1`)
//       .send({
//         firstName: "New",
//       })
//       .set("authorization", `Bearer ${u2Token}`);
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("unauth for anon", async function () {
//     const resp = await request(app)
//       .patch(`/users/u1`)
//       .send({
//         firstName: "New",
//       });
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("not found if no such user", async function () {
//     const resp = await request(app)
//       .patch(`/users/nope`)
//       .send({
//         firstName: "Nope",
//       })
//       .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.statusCode).toEqual(404);
//   });

//   test("bad request if invalid data", async function () {
//     const resp = await request(app)
//       .patch(`/users/u1`)
//       .send({
//         firstName: 42,
//       })
//       .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.statusCode).toEqual(400);
//   });

//   test("works: can set new password", async function () {
//     const resp = await request(app)
//       .patch(`/users/u1`)
//       .send({
//         password: "new-password",
//       })
//       .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.body).toEqual({
//       user: {
//         username: "u1",
//         firstName: "U1F",
//         lastName: "U1L",
//         email: "user1@user.com",
//         isAdmin: false,
//       },
//     });
//     const isSuccessful = await User.authenticate("u1", "new-password");
//     expect(isSuccessful).toBeTruthy();
//   });
// });

// /************************************** DELETE /users/:username */

// describe("DELETE /users/:username", function () {
//   test("works for admin", async function () {
//     const resp = await request(app)
//       .delete(`/users/u1`)
//       .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.body).toEqual({ deleted: "u1" });
//   });

//   test("works for same user", async function () {
//     const resp = await request(app)
//       .delete(`/users/u1`)
//       .set("authorization", `Bearer ${u1Token}`);
//     expect(resp.body).toEqual({ deleted: "u1" });
//   });

//   test("unauth if not same user", async function () {
//     const resp = await request(app)
//       .delete(`/users/u1`)
//       .set("authorization", `Bearer ${u2Token}`);
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("unauth for anon", async function () {
//     const resp = await request(app)
//       .delete(`/users/u1`);
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("not found if user missing", async function () {
//     const resp = await request(app)
//       .delete(`/users/nope`)
//       .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.statusCode).toEqual(404);
//   });
// });

// /************************************** POST /users/:username/jobs/:id */

// describe("POST /users/:username/jobs/:id", function () {
//   test("works for admin", async function () {
//     const resp = await request(app)
//       .post(`/users/u1/jobs/${testJobIds[1]}`)
//       .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.body).toEqual({ applied: testJobIds[1] });
//   });

//   test("works for same user", async function () {
//     const resp = await request(app)
//       .post(`/users/u1/jobs/${testJobIds[1]}`)
//       .set("authorization", `Bearer ${u1Token}`);
//     expect(resp.body).toEqual({ applied: testJobIds[1] });
//   });

//   test("unauth for others", async function () {
//     const resp = await request(app)
//       .post(`/users/u1/jobs/${testJobIds[1]}`)
//       .set("authorization", `Bearer ${u2Token}`);
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("unauth for anon", async function () {
//     const resp = await request(app)
//       .post(`/users/u1/jobs/${testJobIds[1]}`);
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("not found for no such username", async function () {
//     const resp = await request(app)
//       .post(`/users/nope/jobs/${testJobIds[1]}`)
//       .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.statusCode).toEqual(404);
//   });

//   test("not found for no such job", async function () {
//     const resp = await request(app)
//       .post(`/users/u1/jobs/0`)
//       .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.statusCode).toEqual(404);
//   });

//   test("bad request invalid job id", async function () {
//     const resp = await request(app)
//       .post(`/users/u1/jobs/0`)
//       .set("authorization", `Bearer ${adminToken}`);
//     expect(resp.statusCode).toEqual(404);
//   });
// });
