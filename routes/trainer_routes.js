"use strict";

/** Routes for trainers. */
const express = require("express");

const Trainer = require("../models/trainer");
const { ensureLoggedIn, ensureAdmin, ensureCorrectUserOrAdmin } = require("../middleware/auth");
const { createToken } = require("../helpers/tokens");
const Pokemon = require("../models/pokemon");

const router = express.Router();

/** POST /register { email, firstName, lastName, password } => { trainer: { id, firstName, lastName, email, token, isAdmin } }
 * 
 * Adds a new trainer. This returns the newly created trainer and an authentication token for them:
 *  {trainer, token }
 *
 * Authorization required: none
 **/

router.post("/register", async function (req, res, next) {
  try {
    const newTrainer = await Trainer.register(req.body);

    newTrainer.token = createToken(newTrainer);

    return res.status(201).json(newTrainer);
  } catch (err) {
    return next(err);
  }
});

/** POST /login { email, password } => { trainer: { id, firstName, lastName, email, token, password(hashed), isAdmin } }
 * 
 * Login existing trainer. This returns the existing trainer and an authentication token for them:
 *  {trainer, token }
 *
 * Authorization required: none
 **/

router.post("/login", async function (req, res, next) {
  try {
    const trainer = await Trainer.authenticate(req.body);

    trainer.token = createToken(trainer);

    return res.status(201).json(trainer);
  } catch (err) {
    return next(err);
  }
});

/** GET /?[id] => { trainer }
 *
 * Returns { id, email, firstName, lastName, isAdmin }
 *
 * Authorization required: login or admin
 **/

router.get("/", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    const trainer = await Trainer.get(req.query.id);
    return res.json({ trainer });
  } catch (err) {
    return next(err);
  }
});

/** GET /myPokemon?[id] => [pokemon]
 *
 * Returns [{ id, name, image_url, species, prev_id, type : [...], color: [...]} ...]
 *
 * Authorization required: login or admin
 **/

router.get("/myPokemon", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    const pokemonList = await Trainer.getMyPokemon(req.query.id);
    return res.json(pokemonList);
  } catch (err) {
    return next(err);
  }
});

/** POST /myPokemon/add?[id][pokemonId]  =>  { myPokemonId }
 *
 * Authorization required: login or admin
 **/

router.post("/myPokemon/add", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    const result = await Trainer.addNewPokemon(req.query.id, req.query.pokemonId);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
});

/** POST /myPokemon/feed?[id][myPokemonId]  =>  {  }
 *
 * Authorization required: login or admin
 **/

router.post("/myPokemon/feed", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    const result = await Pokemon.feed(req.query.id, req.query.myPokemonId);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
});

/** POST /myPokemon/release?[id][myPokemonId]  =>  {  }
 *
 * Authorization required: login or admin
 **/

router.post("/myPokemon/release", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    const result = await Trainer.removeMyPokemon(req.query.id, req.query.myPokemonId);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
});

/** PATCH /?[id] { firstName, lastName, email } => { id, firstName, lastName, email }
 *
 * Data can include:
 *   { firstName, lastName, password, email }
 *
 * Returns { id, firstName, lastName, email, isAdmin }
 *
 * Authorization required: login or admin
 **/

router.patch("/", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    const trainer = await Trainer.update(req.query.id, req.body);

    console.log(`Update trainer ${req.query.id}`)

    return res.json({ trainer });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /?[id]  =>  { deleted: email }
 *
 * Authorization required: login or admin
 **/

router.delete("/", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    const result = await Trainer.remove(req.query.id);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;