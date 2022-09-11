/** Common config for pokemon tamagotchi */

// Official Pokemon API link
const API_URL = 'https://pokeapi.co/api/v2/pokemon';
const API_SPECIES_URL = 'https://pokeapi.co/api/v2/pokemon-species';
// Only at first 150 pokemon
const POKEMON_LIMIT = 150;
// API limit calls at once before error
const API_LIMIT = 25;
// Required hunger to evolve pokemon
const reqHungerToEvolve = 20;

const BCRYPT_WORK_FACTOR = 12;

const DB_URI = (process.env.DATABASE_URL || (process.env.NODE_ENV === "test")
  ? "postgresql:///pokemon_test"
  : "postgresql:///pokemon").replace("postgres://","postgresql://");

const SECRET_KEY = process.env.SECRET_KEY || "blastoise";

// Port for backend app to deploy
const PORT = process.env.PORT || 3001;

module.exports = { 
  API_URL,
  API_SPECIES_URL,
  POKEMON_LIMIT, 
  API_LIMIT,
  reqHungerToEvolve,
  BCRYPT_WORK_FACTOR,
  DB_URI,
  SECRET_KEY,
  PORT,
};