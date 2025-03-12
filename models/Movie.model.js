const { Schema, model } = require("mongoose");

const movieSchema = new Schema({
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
  imageUrl: {
    type: String,
  },
  videoUrl: {
    type: String,
  },
  gender: {
    type: String,
    enum: ['Terror', 'Animación', 'Acción', 'Comedia', 'Thriller', 'Ciencia Ficción', 'Fantasía', 'Drama'],
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  producer: {
    type: String,
    required: true,
  }
});

// Crear el modelo de la película
const Movie = model("Movie", movieSchema);

module.exports = Movie;
