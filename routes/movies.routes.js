const express = require("express");
const Movie = require("../models/Movie.model");
const { fileUploaderImage, fileUploaderVideo } = require("../config/cloudinary.config");

const movieRouter = express.Router();
// GET all Movies: /api/movies
movieRouter.get("/", (req, res, next) => {
  Movie.find()
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      res.status(500).json({ message: "Internal server error" });
    });
});


// CREATE Movie: /api/movies
movieRouter.post("/", (req, res) => {
  Movie.create({
    title: req.body.title,
    director: req.body.director,
    synopsis: req.body.synopsis,
    imageUrl: req.body.imageUrl,
    videoUrl: req.body.videoUrl,
    gender: req.body.gender,
    rating: req.body.rating,
    duration: req.body.duration,
    year: req.body.year,
    producer: req.body.producer,
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


// GET Movie by ID: /api/movies/id
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


// UPDATE Movie by ID: /api/movies/id
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


// DELETE Movie by ID: /api/movies/id
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


// POST File image: /api/movies/id
movieRouter.post("/upload", fileUploaderImage.single("imageUrl"), (req, res, next) => {
  console.log("file is: ", req.file)
 
  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }
  
  // Get the URL of the uploaded file and send it as a response.
  // 'fileUrl' can be any name, just make sure you remember to use the same when accessing it on the frontend
  
  res.json({ fileUrl: req.file.path });
});
 
movieRouter.post("/fileVideo", fileUploaderVideo.single("videoUrl"), (req, res, next) => {
  console.log("Video file is: ", req.file);

  if (!req.file) {
    return next(new Error("No video uploaded!"));
  }

  res.json({ fileUrl: req.file.path });
});
module.exports = movieRouter;
