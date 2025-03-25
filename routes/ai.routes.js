const express = require("express");
const { chatBot, recomendarPorGenero} = require("../services/ai.services");
const User = require("../models/User.model");
const router = express.Router();

router.post("/chat", async (req, res) => {
    try {
        const { prompt } = req.body;

        // Validación del prompt
        if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
            return res.status(400).json({ error: "El prompt es inválido o está vacío." });
        }

        // Llama al servicio del chatbot
        const response = await chatBot(prompt);

        res.status(200).json({ response });
    } catch (error) {
        console.error("Error en el endpoint de chatbot:", error);
        res.status(500).json({ error: "Error al procesar la solicitud del chatbot." });
    }
});


router.get("/recommend", async (req, res) => {
    try {
        const { userId } = req.query; // Recibe el ID del usuario desde los parámetros de consulta

        // Validación del userId
        if (!userId) {
            return res.status(400).json({ error: "El ID del usuario es requerido." });
        }

        // Buscar al usuario y sus favoritos
        const user = await User.findById(userId).populate("favouriteMovie");
        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado." });
        }

        // Obtener los géneros de las películas en favoritos
        const generosFavoritos = user.favouriteMovie.map((movie) => movie.gender);

        let generoSeleccionado;

        if (generosFavoritos.length > 0) {
            // Seleccionar un género aleatorio de los favoritos del usuario
            generoSeleccionado = generosFavoritos[Math.floor(Math.random() * generosFavoritos.length)];
            console.log("Género seleccionado de favoritos:", generoSeleccionado);
        } else {
            // Si no hay favoritos, seleccionar un género aleatorio de la lista predeterminada
            const generosDisponibles = ['Terror', 'Animación', 'Acción', 'Comedia', 'Thriller', 'Ciencia Ficción', 'Fantasía', 'Drama'];
            generoSeleccionado = generosDisponibles[Math.floor(Math.random() * generosDisponibles.length)];
            console.log("Género seleccionado de la lista predeterminada:", generoSeleccionado);
        }

        // Obtener recomendaciones
        const recomendaciones = await recomendarPorGenero(generoSeleccionado, 4);

        res.status(200).json({ genero: generoSeleccionado, recomendaciones });
    } catch (error) {
        console.error("Error al obtener recomendaciones:", error.message);
        res.status(500).json({ error: "Hubo un error al obtener las recomendaciones." });
    }
});

module.exports = router;