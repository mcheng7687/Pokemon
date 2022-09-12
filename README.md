# Pokemon server for Pokemon Tamagotchi

This is for the server end to provide all the information from Postgresql database to client end Pokemon Tamagotchi. This RESTful API server utilizes NodeJS with the Express framework.

Download all the files and run this command in the project directory to install all dependencies.

### `npm i`

In order to get this server running, it is crucial to provide the initial database of pokemon information.


## Available Initial Database

In the project directory, you can run:

### `psql pokemon < pokemon_data.sql`

This requires a database in PostgreSQL named "pokemon". This sql file was created from "pg_dump pokemon > pokemon_data.sql" to export the initial Pokemon data taken from https://pokeapi.co.


## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the server in the development mode.
All routes are taken from [http://localhost:3001].

### `npm test`

Runs all unit tests.


## Available Routes

All data returned from routes are in JSON format.

### GET `/pokemon/get`

Authorization required: None

Returns array of all pokemon species: [ [ {id, name, image_url, prev_id, species, type : [...], color: [...]}, ...], ...]

### GET `/pokemon/get?id`

Authorization required: None

Returns pokemon species where a pokemon's id in species is EQUAL to "id": [ {id, name, image_url, prev_id, species, type : [...], color: [...]}, ...]

### GET `/pokemon/get?name`

Authorization required: None

Returns an array of pokemon species where a pokemon's name in species CONTAINS "name" (case insensitive): [ [ { id, name, image_url, prev_id, species, type : [...], color: [...] }, ...], ...]

### POST `/pokemon/add?id`

Authorization required: None

This can add specific pokemon to the pokemon database that aren't included yet. Adds a new pokemon species to pokemon PostgreSQL database where a pokemon's id in the species is EQUAL to "id".  Returns the pokemon species: [ { id, name, image_url, prev_id, species, type : [...], color: [...] }, ...]

### POST `/pokemon/add?name`

Authorization required: None

This can add specific pokemon to the pokemon database that aren't included yet. Adds a new pokemon species to pokemon PostgreSQL database where a pokemon's name in species EQUALS "name" (case insensitive).  Returns an array of pokemon species: [ [ { id, name, image_url, prev_id, species, type : [...], color: [...] }, ...], ...]

### POST `/pokemon/reset`

Authorization required: Admin

Reverts the pokemon database back to original values as taken from https://pokeapi.co. Due to the sheer number of API calls, this can take a few minutes to complete.

### POST `/trainer/register`

Authorization required: None

Register a new user. Required information includes first name, last name, email, and password. Each email used for registration must be unique as the email is used for the username login. Returns the new user info including personal id (auto-generated) and token: { id, email, firstName, lastName, isAdmin, token }

### POST `/trainer/login`

Authorization required: None

Login an existing user. Required information includes email, and password. Returns the existing user info including personal id and token. { id, email, firstName, lastName, isAdmin, token, password (hashed) }

### GET `/trainer?id`

Authorization required: Admin or Correct User

Get an existing user info. Required token sent as Authorization header to verify if the correct associated user or an admin. Returns the existing user info: { id, email, firstName, lastName, isAdmin }

### PATCH `/trainer?id`

Authorization required: Admin or Correct User

Update an existing user info with id equal to "id", including first name, last name, and email. Required token sent as Authorization header to verify if the correct associated user or an admin. Returns the updated user info: { id, email, firstName, lastName, isAdmin }

### DELETE `/trainer?id`

Authorization required: Admin or Correct User

Delete an existing user with id equal to "id". Required token sent as Authorization header to verify if the correct associated user or an admin. Returns: { message }

### GET `/trainer/myPokemon?id`

Authorization required: Admin or Correct User

Get an existing user pokemon list. Required user id in query string and required token sent as Authorization header to verify if the correct associated user or an admin. Returns an array of existing user's pokemon: [ { id, name, trainerPokemonId, image_url, hunger, type : [...], color: [...] }, ...]

### POST `/trainer/myPokemon/add?id&pokemonId`

Authorization required: Admin or Correct User

Add a new pokemon to existing user pokemon list. Required user id and pokemonId in query string and required token sent as Authorization header to verify if the correct associated user or an admin. Returns personal trainer pokemon id: {myPokemonId}

### POST `/trainer/myPokemon/feed?id&myPokemonId`

Authorization required: Admin or Correct User

Feed a user's pokemon. Required user id and myPokemonId in query string and required token sent as Authorization header to verify if the correct associated user or an admin. Returns personal trainer pokemon id: { myPokemonId, pokemoId, hunger }

### POST `/trainer/myPokemon/release?id&myPokemonId`

Authorization required: Admin or Correct User

Releases a user's pokemon. Required user id and myPokemonId in query string and required token sent as Authorization header to verify if the correct associated user or an admin. Returns personal trainer pokemon id: { myPokemonId, pokemonId, trainerId }

