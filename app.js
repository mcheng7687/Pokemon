/** Express app. */

const express = require("express");
const cors = require("cors");

const { authenticateJWT } = require("./middleware/auth");

const pokeRoutes = require("./routes/pokemon_routes");
const trainerRoutes = require("./routes/trainer_routes");

const app = express();

// allow connections to all routes from any browser
app.use(cors());
app.use(express.json());
// app.use(express.urlencoded());
app.use(authenticateJWT);

app.use("/pokemon",pokeRoutes);
app.use("/trainer",trainerRoutes);

/** 404 handler */

app.use(function(req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;

  return next(err);
});

/** general error handler */

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json(err);
});

module.exports = app;