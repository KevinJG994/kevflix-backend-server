const express = require("express");
const Movie = require("../models/Movie.model");

const movieRouter = express.Router();

// Ruta para obtener todas las películas
movieRouter.get("/", (req, res, next) => {
  Movie.find()
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      res.status(500).json({ message: "Internal server error" });
    });
});

// Ruta para obtener una película por ID
movieRouter.get("/:id", (req, res, next) => {
  const movieId = req.params.id;

  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }
      res.status(200).json(movie);
    })
    .catch((err) => {
      res.status(500).json({ message: "Internal server error" });
    });
});

module.exports = movieRouter;