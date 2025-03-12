const express = require("express");
const Serie = require("../models/Serie.model");
const { fileUploaderImage, fileUploaderVideo } = require("../config/cloudinary.config");

const serieRouter = express.Router();

// GET all Series: /api/series
serieRouter.get("/", (req, res, next) => {
  Serie.find()
    .then((series) => {
      res.status(200).json(series);
    })
    .catch((err) => {
      res.status(500).json({ message: "Internal server error" });
    });
});


// CREATE Serie: /api/series
serieRouter.post("/", (req, res) => {
  Serie.create({
    title: req.body.title,
    director: req.body.director,
    synopsis: req.body.synopsis,
    imageUrl: req.body.imageUrl,
    videoUrl: req.body.videoUrl,
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


// GET Serie by ID: /api/series/:serieId
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


// UPDATE Serie by ID: /api/series/:serieId
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


// DELETE Serie by ID: /api/series/:serieId
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

// POST File image: /api/series/upload
serieRouter.post("/upload", fileUploaderImage.single("imageUrl"), (req, res, next) => {
  console.log("file is: ", req.file)
 
  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }
  
  // Get the URL of the uploaded file and send it as a response.
  // 'fileUrl' can be any name, just make sure you remember to use the same when accessing it on the frontend
  
  res.json({ fileUrl: req.file.path });
});
 

// POST File video: /api/series/fileVideo
serieRouter.post("/fileVideo", fileUploaderVideo.single("videoUrl"), (req, res, next) => {
  console.log("Video file is: ", req.file);

  if (!req.file) {
    return next(new Error("No video uploaded!"));
  }

  res.json({ fileUrl: req.file.path });
});

module.exports = serieRouter;
