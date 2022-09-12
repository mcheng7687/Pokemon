/** Routes for Pokemon */

const express = require("express");

const Pokemon = require("../models/pokemon");
const { ensureLoggedIn, ensureAdmin, ensureCorrectUserOrAdmin } = require("../middleware/auth");

const router = new express.Router();


const { POKEMON_LIMIT, API_LIMIT } = require("../config");

/** GET /get - Get list of pokemon with either id or name from query.
 * If neither is specified in query, provide list of all Pokemon.
 * 
 *  => [ {id, name, image_url, prev_id, species, type : [...], color: [...]}, ...]
 * 
 * Priority of using query "id". 
 * 
 */
router.get("/get", async function (req, res, next) {
  try {
    const id = req.query.id, name = req.query.name;

    let pokemon;

    if (id || name) {
      pokemon = await Pokemon.get({ id, name });
    }
    else {
      pokemon = await Pokemon.all();
    }

    return res.json(pokemon);
  } catch (err) {
    return next(err);
  }
});


/** POST /add - Add a new pokemon with id from query string.
 * 
 *  => [ {id, name, image_url, next_id, type : [...]}]
 * 
 * 
 */
router.post("/add", ensureLoggedIn, async function (req, res, next) {
  try {
    const id = req.query.id, name = req.query.name;

    let pokemon;

    if (id || name) {
      pokemon = await Pokemon.add(id);
    }

    return res.json(pokemon);
  } catch (err) {
    return next(err);
  }
});


/** POST /reset - Reset database to original tables.
 * 
 */
router.post("/reset", ensureAdmin, async function (req, res, next) {
  try {
    Pokemon.clearDatabase();

    for (let i = 0; i < POKEMON_LIMIT; i = i + API_LIMIT) {
      await Pokemon.resetAll(i);
    }

    return res.json({ status: "Complete" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;