/** Pokemon Tamagotchi */

const db = require("../db");
const bcrypt = require("bcrypt");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const Pokemon = require("./pokemon");

const { BCRYPT_WORK_FACTOR } = require("../config");

/** Trainer model. */

class Trainer {

  /** Register new user -- returns {id, firstName, lastName, email, isAdmin} */
  static async register({ firstName, lastName, email, password }) {

    // Check if email is already in database
    const result = await db.query(`
      SELECT id
      FROM trainer
      WHERE email=$1
    `, [email]);

    if (result.rows.length > 0) {
      throw new BadRequestError(`This email is already registered.`);
    }

    console.log(`Adding trainer user ${firstName} ${lastName}.`);

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    const trainer = await db.query(`
      INSERT INTO trainer (email, first_name, last_name, password) 
      VALUES ($1, $2, $3, $4)
      RETURNING id, first_name AS "firstName", last_name AS "lastName", email, isadmin AS "isAdmin"`,
      [
        email,
        firstName,
        lastName,
        hashedPassword,
      ]);

    return trainer.rows[0];
  }

  /** Authenticate: is this email/password valid? 
   * Returns trainer info -- {id, email, firstName, lastName, password, isAdmin}. 
   */

  static async authenticate({ email, password }) {

    const result = await db.query(`
      SELECT id, email, first_name AS "firstName", last_name AS "lastName", password, isadmin AS "isAdmin"
      FROM trainer
      WHERE email = $1`,
      [email]);

    if (result.rows.length === 0) {
      throw new NotFoundError(`No email found.`);
    }

    const trainer = result.rows[0];
    const validPassword = await bcrypt.compare(password, trainer.password);

    if (!validPassword) {
      throw new UnauthorizedError("Invalid email/password");
    }

    return trainer;
  }

  /** Get: Trainer info -- returns {id, firstName, lastName, email, isAdmin}
  * 
  */

  static async get(id) {
    const result = await db.query(`
      SELECT id, email, first_name AS "firstName", last_name AS "lastName", isadmin AS "isAdmin"
      FROM trainer
      WHERE id = $1`,
      [id]
    );

    return result.rows[0];
  }

  /** Update: trainer {id} -- returns {id, firstName, lastName, email, isAdmin} */

  static async update(id, { firstName, lastName, email }) {
    const result = await db.query(`
        UPDATE trainer
        SET first_name = $2, last_name = $3, email = $4
        WHERE id = $1
        RETURNING id, first_name AS "firstName", last_name AS "lastName", email, isadmin as "isAdmin"`,
      [id, firstName, lastName, email]
    );

    return result.rows[0];
  }

  /** Remove: trainer {id} */

  static async remove(id) {
    const result = await db.query(`
      DELETE FROM trainer
      WHERE id = $1
      RETURNING email`,
      [id]
    );

    return { message: `${result.rows[0].email} removed` };
  }

  /** All: basic info on all users -- returns [{email, first_name, last_name}, ...] */

  static async all() {
    const results = await db.query(`
      SELECT email, first_name AS "firstName", last_name AS "lastName"
      FROM trainer`);

    return results.rows;
  }

  /** Clear: delete all trainers in database
   * 
   */
  static async clearDatabase() {
    await db.query(`DELETE FROM trainer`);

    return { message: 'All trainers removed from database.' };
  }

  /** Add Pokemon: add pokemon to trainer's pokemon list */

  static async addNewPokemon(trainerId, pokemonId) {
    if (!Pokemon.checkPokemonId(pokemonId)) {
      throw new NotFoundError(`This pokemon ID does not exist.`);
    }

    await db.query(`
      INSERT INTO trainer_pokemon (trainer_id, pokemon_id)
      VALUES ($1, $2)
    `,[trainerId, pokemonId]);

    return { message: `Added new pokemon to trainer ${trainerId}.` };
  }

  /** Get All Pokemon: get trainer's pokemon list */

  static async getMyPokemon(trainerId) {
    const pokemonList = await db.query(`
      SELECT trainer_pokemon.id AS "trainerPokemonId", name, image_url, trainer_pokemon.pokemon_id AS "id", hunger, ARRAY_AGG(pokemon_type.type) as type, ARRAY_AGG(color) as color
      FROM trainer_pokemon
      JOIN pokemon ON pokemon.id = trainer_pokemon.pokemon_id
      JOIN pokemon_type ON pokemon_type.pokemon_id = trainer_pokemon.pokemon_id
      JOIN types ON pokemon_type.type = types.type
      WHERE trainer_id = $1
      GROUP BY (trainer_pokemon.id, name, image_URL, trainer_pokemon.pokemon_id)
      ORDER BY trainer_pokemon.id
    `, [trainerId]);

    return pokemonList.rows;
  }

  /** Remove Pokemon: remove pokemon from trainer's pokemon list */

  static async removePokemon(myPokemonId) {

    const removed = await db.query(`
        DELETE FROM trainer_pokemon 
        WHERE id = $1
        RETURNING trainer_id AS "trainerId", pokemon_id AS "pokemonId"`,
      [myPokemonId]
    );

    if (removed.rows.length === 0) {
      throw new NotFoundError(`You have no such pokemon.`);
    }

    return { message: `Removed pokemon id ${removed.rows[0].pokemonId} from trainer ${removed.rows[0].trainerId}.` };
  }
}

module.exports = Trainer;