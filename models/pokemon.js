/** Pokemon Tamagotchi */

const db = require("../db");
const axios = require("axios");
const fs = require("fs");
const { API_URL, API_SPECIES_URL, API_LIMIT, reqHungerToEvolve } = require("../config");
const { NotFoundError } = require("../expressError");

/** Pokemon model. */

class Pokemon {
  static #capitalize(str) {
    return str[0].toUpperCase() + str.slice(1);
  };

  static async checkPokemonId(pokemonId) {
    const result = await db.query(`
      SELECT name
      FROM pokemon
      WHERE id = $1
    `, [pokemonId]);

    return result.rows.length > 0;
  }

  /**
   * 
   */
  static async get({ id, name }) {
    let species;

    if (name) {
      console.log(`Search where name contains ${name}`);
      species = await db.query(`
        SELECT species
        FROM pokemon
        WHERE name ILIKE $1
        GROUP BY species
        ORDER BY species
      `, [`%${name}%`]);
    }
    else if (id) {
      console.log(`Search where id = ${id}`);
      species = await db.query(`
        SELECT species
        FROM pokemon
        WHERE id = $1
      `, [id]);
    }
    else {
      return { message: 'No ID or name given.' };
    }

    if (species.rows.length === 0) { 
      throw new NotFoundError(`There is no such pokemon.`);
    }

    const pokeIDs = await db.query(`
      SELECT id
      FROM pokemon
      WHERE species = ANY(ARRAY[${species.rows.map(ele => ele.species).join(",")}])
      ORDER BY id
      `);

    const pokeResult = await db.query(`
      SELECT pokemon.id as id, name, image_url, species, pre_evolve_id AS prev_id, ARRAY_AGG(pokemon_type.type) as type, ARRAY_AGG(color) as color
      FROM pokemon
      FULL OUTER JOIN evolution ON pokemon.id = evolution.post_evolve_id
      JOIN pokemon_type ON pokemon.id = pokemon_id
      JOIN types ON pokemon_type.type = types.type
      WHERE id = ANY(ARRAY[${pokeIDs.rows.map(ele => ele.id).join(",")}])
      GROUP BY (id, pre_evolve_id)
      ORDER BY id
    `);

    return pokeResult.rows;
  }

  /**
  * 
  */
  static async feed(id, myPokemonId) {
    const currentPoke = await db.query(`
      SELECT pokemon_id AS "pokemonId", hunger
      FROM trainer_pokemon
      WHERE id = $1 AND trainer_id=$2
    `, [myPokemonId, id]);

    if (currentPoke.rows.length === 0) {
      throw new NotFoundError(`There is no such pokemon.`);
    }

    let { pokemonId, hunger } = currentPoke.rows[0];
    hunger++;

    const nextEvolution = await db.query(`
      SELECT post_evolve_id AS "nextId"
      FROM evolution
      WHERE pre_evolve_id = $1
    `, [pokemonId]);

    if (nextEvolution.rows.length > 0 && hunger >= reqHungerToEvolve) {
      console.log("Evolve!")
      hunger = 0;
      pokemonId = nextEvolution.rows[Math.floor(Math.random() * nextEvolution.rows.length)].nextId;
    }

    const updatedHunger = await db.query(`
      UPDATE trainer_pokemon
      SET hunger = $2, pokemon_id = $3
      WHERE id = $1
      RETURNING id AS "myPokemonId", pokemon_id AS "pokemonId", hunger
    `, [myPokemonId, hunger, pokemonId]);

    return updatedHunger.rows[0];
  }

  /**
   * 
   */
  static async add(id) {

    // Check if id is already in database
    const check_duplicate = await db.query(`
      SELECT name 
      FROM pokemon
      WHERE id=$1
    `, [id]);

    if (check_duplicate.rows.length > 0) {
      return { status: 500, message: 'This pokemon already exists.' }
    }

    const pokemon_info = await axios.get(`${API_SPECIES_URL}/${id}`);
    const pokemon_species = await axios.get(pokemon_info.data.evolution_chain.url);

    function getPokemonInSpecies(data) {
      if (data.evolves_to.length === 0)
        return [data.species.name];

      return [data.species.name, ...getPokemonInSpecies(data.evolves_to[0])];
    }

    const pokemon_list = getPokemonInSpecies(pokemon_species.data.chain);
    let pre_evolve_id = null;

    for (let pokemon_name of pokemon_list) {
      let pokemon = await axios.get(`${API_URL}/${pokemon_name}`);

      db.query(`INSERT INTO pokemon (id, name, image_URL, species) VALUES ($1, $2, $3, $4)`, [
        pokemon.data.id,
        this.#capitalize(pokemon.data.name),
        pokemon.data.sprites.other.home.front_default,
        pokemon_info.data.evolution_chain.url.split('/').slice(-2)[0],
      ]);

      for (let type of pokemon.data.types) {
        db.query(`INSERT INTO pokemon_type (pokemon_id, type) VALUES ($1, $2)`, [
          pokemon.data.id,
          type.type.name,
        ]);
      };

      if (pre_evolve_id) {
        db.query(`INSERT INTO evolution (pre_evolve_id, post_evolve_id) VALUES ($1, $2)`,
          [pre_evolve_id, pokemon.data.id]);
      }

      pre_evolve_id = pokemon.data.id;
    }

    return this.get({ id });
  }

  /**
   * 
   */
  static async all() {
    const pokeResult = await db.query(`
      SELECT pokemon.id as id, name, image_url, species, pre_evolve_id AS prev_id, ARRAY_AGG(pokemon_type.type) as type, ARRAY_AGG(color) as color
      FROM pokemon
      FULL OUTER JOIN evolution ON pokemon.id = evolution.post_evolve_id
      JOIN pokemon_type ON pokemon.id = pokemon_id
      JOIN types ON pokemon_type.type = types.type
      GROUP BY (id, pre_evolve_id)
      ORDER BY id
    `);

    return pokeResult.rows;
  }

  /**
   * 
   */
  static async clearDatabase() {
    const sql = fs.readFileSync('./pokemon.sql').toString();
    await db.query(sql);
  }

  /**
   * 
   */
  static async resetAll(offset = 0) {
    const pokeResult = await axios.get(API_URL, { params: { offset, limit: API_LIMIT } });
    const pokemon_list = [];

    // Get all info from Poke API and store in pokemon_list
    for (let pokemon of pokeResult.data.results) {
      pokemon_list.push(axios.get(pokemon.url));
      pokemon_list.push(axios.get(`${API_SPECIES_URL}/${pokemon.name}`));
    }

    return Promise.all(pokemon_list)
      .then(async function (pokemon_list) {

        for (let i = 0; i < pokemon_list.length; i = i + 2) {
          // Insert into db all pokemon from pokeapi.co
          db.query(`INSERT INTO pokemon (id, name, image_URL, species) VALUES ($1, $2, $3, $4)`, [
            pokemon_list[i].data.id,
            this.#capitalize(pokemon_list[i].data.name),
            pokemon_list[i].data.sprites.other.home.front_default,
            pokemon_list[i + 1].data.evolution_chain.url.split('/').slice(-2)[0],
          ]);

          // Insert into db all pokemon with pokemon types
          for (let type of pokemon_list[i].data.types) {
            db.query(`INSERT INTO pokemon_type (pokemon_id, type) VALUES ($1, $2)`, [
              pokemon_list[i].data.id,
              type.type.name,
            ]);
          }

          // Insert into db of all evolution stages
          if (pokemon_list[i + 1].data.evolves_from_species !== null) {
            const results = await db.query(`SELECT id FROM pokemon WHERE name ILIKE $1`,
              [pokemon_list[i + 1].data.evolves_from_species.name]);

            if (results.rows.length >= 1) {
              let pre_evolve_id = results.rows[0].id;

              db.query(`INSERT INTO evolution (pre_evolve_id, post_evolve_id) VALUES ($1, $2)`,
                [pre_evolve_id, pokemon_list[i].data.id]);
            }
          }
        }
      });
  }
}

module.exports = Pokemon;