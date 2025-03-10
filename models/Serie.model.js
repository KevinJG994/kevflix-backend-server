const { Schema, model } = require("mongoose");

const serieSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  synopsis: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  video: {
    type: String,
    required: true,
  },
  gender: {
    enum: ['Terror', 'Animación', 'Acción', 'Comedia', 'Thriller', 'Ciencia Ficción', 'Fantasía', 'Drama'],
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
  seasons: {
    type: Number,
    required: true,
  },
  episodes: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
});

// Crear el modelo de la película
const Serie = model("Serie", serieSchema);

module.exports = Serie;
