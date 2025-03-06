const express = require("express");
const Serie = require("../models/Serie.model");

const serieRouter = express.Router();

// Ruta para obtener todas las películas
serieRouter.get("/", (req, res, next) => {
  Serie.find()
    .then((series) => {
      res.status(200).json(series);
    })
    .catch((err) => {
      res.status(500).json({ message: "Internal server error" });
    });
});

// Ruta para obtener una película por ID
serieRouter.get("/:serieId", (req, res, next) => {
  const serieId = req.params.serieId;

  Serie.findById(serieId)
    .then((serie) => {
      if (!serie) {
        return res.status(404).json({ message: "Serie not found" });
      }
      res.status(200).json(serie);
    })
    .catch((err) => {
      res.status(500).json({ message: "Internal server error" });
    });
});

serieRouter.post("/", (req, res) => {
  Serie.create({
    title: req.body.title,
    director: req.body.director,
    synopsis: req.body.synopsis,
    image: req.body.image,
    video: req.body.video,
    gender: req.body.gender,
    rating: req.body.rating,
    seasons: req.body.seasons,
    episodes: req.body.episodes,
    year: req.body.year,
  })
    .then((createSerie) => {
      console.log("Serie created ", createSerie);
      res.status(201).json(createSerie);
    })
    .catch((err) => {
      console.error(err, "Error to create serie");
      res.status(500).json({ error: "Failed to create serie" + err });
    });
});

serieRouter.put("/:serieId", (req, res) => {
  const serieId = req.params.serieId;

  Serie.findByIdAndUpdate(serieId, req.body, { new: true })
    .then((updatedSerie) => {
      console.log("Retrieved serie ->", updatedSerie);

      res.status(204).json(updatedSerie);
    })
    .catch((err) => {
      console.error(err, "Error to update serie");
      res.status(500).json({ error: "Failed to update serie" + err });
    });
});

//DELETE STUDENT BY ID
serieRouter.delete("/:serieId", (req, res) => {
  const serieId = req.params.serieId;

  Serie.findByIdAndDelete(serieId)
    .then((result) => {
      console.log("Serie deleted!");

      res.status(204).send(); // Send back only status code 204 indicating that resource is deleted
    })

    .catch((error) => {
      console.error("Error while deleting the serie ->", error);

      res.status(500).json({ error: "Deleting serie failed" });
    });
});

module.exports = serieRouter;
