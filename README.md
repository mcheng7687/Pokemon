# Pokemon server for Pokemon Tamagotchi

This is for the server end to provide all the information from Postgresql database to client end Pokemon Tamagotchi. This RESTful API server utilizes NodeJS with the Express framework.

Download all the files and run this command in the project directory to install all dependencies.

### `npm i`


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


## Routes

### GET `/pokemon/get`

