DROP TABLE IF EXISTS evolution;
DROP TABLE IF EXISTS trainer_pokemon;
DROP TABLE IF EXISTS trainer;
DROP TABLE IF EXISTS pokemon_type;
DROP TABLE IF EXISTS pokemon;
DROP TABLE IF EXISTS types;
DROP TABLE IF EXISTS settings;

CREATE TABLE trainer (
  id SERIAL PRIMARY KEY,
  email text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  password text NOT NULL,
  isAdmin BOOLEAN DEFAULT false
);

CREATE TABLE types (
  type text PRIMARY KEY,
  color text NOT NULL
);

CREATE TABLE pokemon (
  id integer PRIMARY KEY,
  name text NOT NULL,
  image_URL text NOT NULL,
  species integer NOT NULL
);

CREATE TABLE pokemon_type (
  pokemon_id INTEGER REFERENCES pokemon(id) ON DELETE CASCADE,
  type TEXT REFERENCES types(type)
);

CREATE TABLE evolution (
  pre_evolve_id INTEGER REFERENCES pokemon(id) ON DELETE CASCADE,
  post_evolve_id INTEGER REFERENCES pokemon(id) ON DELETE CASCADE,
  PRIMARY KEY (pre_evolve_id, post_evolve_id)
);

CREATE TABLE trainer_pokemon (
  id SERIAL PRIMARY KEY,
  trainer_id INTEGER REFERENCES trainer(id) ON DELETE CASCADE,
  pokemon_id INTEGER REFERENCES pokemon(id) ON DELETE CASCADE,
  hunger INTEGER DEFAULT 0
);

CREATE TABLE settings (
  descript text PRIMARY KEY,
  setting text NOT NULL
);

INSERT INTO types
  (type, color)
VALUES
  ('normal'   , 'white'),
  ('fighting' , 'tan'),
  ('flying'   , 'white'),
  ('poison'   , 'green'),
  ('ground'   , 'tan'),
  ('rock'     , 'tan'),
  ('bug'      , 'green'),
  ('ghost'    , 'purple'),
  ('steel'    , 'gray'),
  ('fire'     , 'red'),
  ('water'    , 'blue'),
  ('grass'    , 'green'),
  ('electric' , 'yellow'),
  ('psychic'  , 'purple'),
  ('ice'      , 'blue'),
  ('dragon'   , 'white'),
  ('dark'     , 'black'),
  ('fairy'    , 'white'),
  ('shadow'   ,'purple');