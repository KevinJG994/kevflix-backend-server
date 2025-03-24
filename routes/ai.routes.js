const express = require("express");
const { chatBot, recomendarPorGenero} = require("../services/ai.services");

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

router.get("/recomendations", async (req, res) => {
    try {
        const generosDisponibles = ['Terror', 'Animación', 'Acción', 'Comedia', 'Thriller', 'Ciencia Ficción', 'Fantasía', 'Drama'];
        const generoSeleccionado = generosDisponibles[Math.floor(Math.random() * generosDisponibles.length)];

        console.log("Género seleccionado:", generoSeleccionado);

        const recomendaciones = await recomendarPorGenero(generoSeleccionado, 5);

        console.log("Recomendaciones obtenidas:", recomendaciones);

        res.status(200).json({ genero: generoSeleccionado, recomendaciones });
    } catch (error) {
        console.error("Error al obtener recomendaciones:", error);
        res.status(500).json({ error: "Hubo un error al obtener las recomendaciones." });
    }
});
module.exports = router;