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

movieRouter.post("/", (req, res) => {
  Movie.create({
    title: req.body.title,
    director: req.body.director,
    synopsis: req.body.synopsis,
    image: req.body.image,
    video: req.body.video,
    gender: req.body.gender,
    rating: req.body.rating,
    duration: req.body.duration,
    year: req.body.year,
  })
    .then((createMovie) => {
      console.log("Movie created ", createMovie);
      res.status(201).json(createMovie);
    })
    .catch((err) => {
      console.error(err, "Error to create movie");
      res.status(500).json({ error: "Failed to create movie" + err });
    });
});

movieRouter.put("/:movieId", (req, res) => {
  const movieId = req.params.movieId;

  Movie.findByIdAndUpdate(movieId, req.body, { new: true })
    .then((updatedMovie) => {
      console.log("Retrieved students ->", updatedMovie);

      res.status(204).json(updatedMovie);
    })
    .catch((err) => {
      console.error(err, "Error to update movie");
      res.status(500).json({ error: "Failed to update movie" + err });
    });
});

//DELETE STUDENT BY ID
movieRouter.delete("/:movieId", (req, res) => {
  const movieId = req.params.movieId;

  Movie.findByIdAndDelete(movieId)
    .then((result) => {
      console.log("Movie deleted!");

      res.status(204).send(); // Send back only status code 204 indicating that resource is deleted
    })

    .catch((error) => {
      console.error("Error while deleting the movie ->", error);

      res.status(500).json({ error: "Deleting movie failed" });
    });
});

module.exports = movieRouter;
