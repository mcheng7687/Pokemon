const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

/** return signed JWT from user data. */

function createToken(trainer) {

  console.assert(trainer.isAdmin !== undefined,
      "createToken passed user without isAdmin property");

  let payload = {
    id: trainer.id,
    isAdmin: trainer.isAdmin || false,
  };

  const token = jwt.sign(payload, SECRET_KEY);

  return token;
}

module.exports = { createToken };
