const { GoogleGenerativeAI } = require("@google/generative-ai");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const mongoUri = process.env.MONGODB_URI;
const dbName = "kevflix-api-data";

async function obtenerInfoRelevante() {
    const client = new MongoClient(mongoUri);
    try {
        await client.connect();
        const db = client.db(dbName);

        console.log("Obteniendo toda la información de películas y series...");

        // Recupera todas las películas
        const moviesCollection = db.collection("movies");
        const movies = await moviesCollection.find({}).toArray();

        // Recupera todas las series
        const seriesCollection = db.collection("series");
        const series = await seriesCollection.find({}).toArray();

        // Formatea la información obtenida
        let info = "";

        if (movies.length > 0) {
            info += "Películas disponibles:\n";
            info += movies
                .map((movie) => `- Título: ${movie.title}\n Director: ${movie.director}\n  Sinopsis: ${movie.synopsis}\n  Género: ${movie.gender}\n  Año: ${movie.year}\n  Duración: ${movie.duration}\n Productora: ${movie.producer}\n  Valoración: ${movie.rating}`)
                .join("\n");
        }

        if (series.length > 0) {
            info += "\nSeries disponibles:\n";
            info += series
                .map((serie) => `- Título: ${serie.title}\n Director: ${serie.director}\n  Sinopsis: ${serie.synopsis}\n  Género: ${serie.gender}\n  Temporadas: ${serie.seasons}\n Episodios: ${serie.episodes}\n  Año: ${serie.year}/n Valoración: ${serie.rating}`)
                .join("\n");
        }

        return info || "No hay información disponible en la base de datos.";
    } catch (error) {
        console.error("Error al obtener información de MongoDB:", error);
        return "Hubo un error al obtener la información de la base de datos.";
    } finally {
        await client.close();
    }
}

async function chatBot(prompt) {
    try {
        // Obtén toda la información de la base de datos
        const informacionExtra = await obtenerInfoRelevante();

        if (!informacionExtra) {
            return "Lo siento, no encontré información disponible en la base de datos.";
        }

        // Construye el prompt mejorado
        const enhancedPrompt = `
                                El usuario está preguntando: "${prompt}"
                                Aquí hay toda la información disponible de nuestra base de datos:
                                ${informacionExtra}
                                Por favor, utiliza esta información para responder la pregunta del usuario de manera precisa,
                                además formatea la respuesta con salto de línea (\\n) para separar párrafos y listas,
                                usa (-) para las listas en lugar de asteriscos (*)
                                `;

        // Llama a la API de Gemini con el prompt mejorado
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        console.log("Enviando prompt a Gemini:", enhancedPrompt);
        const result = await model.generateContent(enhancedPrompt);
        console.log("Resultado de la API de Gemini:", result);

        // Validación de la respuesta
        const candidates = result.response?.candidates;
        if (!candidates || candidates.length === 0) {
            console.error("Respuesta inválida de Gemini:", result);
            throw new Error("La API de Gemini no devolvió una respuesta válida.");
        }

        const response = candidates[0].content;
        return response;
    } catch (error) {
        console.error("Error en el servicio de chatbot:", error);

        // Manejo específico para error 429 (Too Many Requests)
        if (error.response && error.response.status === 429) {
            console.log("❌ Límite de solicitudes alcanzado");
            return "Has alcanzado el límite de solicitudes. Intenta de nuevo más tarde.";
        }

        // Manejo genérico de errores
        return "Hubo un error al procesar tu solicitud.";
    }
}

async function recomendarPorGenero(genero, limite) {
    const client = new MongoClient(mongoUri);
    try {
        await client.connect();
        const db = client.db(dbName);

        console.log("Buscando películas para el género:", genero);
        const movies = await db.collection("movies").find({ gender: genero }).limit(limite).toArray();
        console.log("Películas encontradas:", movies);

        console.log("Buscando series para el género:", genero);
        const series = await db.collection("series").find({ gender: genero }).limit(limite).toArray();
        console.log("Series encontradas:", series);

        // Si no hay suficientes resultados en MongoDB, usa Gemini como respaldo
        if (movies.length + series.length < limite) {
            console.log("No hay suficientes resultados en MongoDB. Llamando a Gemini...");
            const prompt = `
                Por favor, genera una lista de ${limite} recomendaciones de películas o series que pertenezcan al género "${genero}".
            `;
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
            const result = await model.generateContent(prompt);

            const candidates = result.response?.candidates;
            if (candidates && candidates.length > 0) {
                const recomendacionesGemini = JSON.parse(candidates[0].content); // Asegúrate de que Gemini devuelva un JSON válido
                console.log("Recomendaciones de Gemini:", recomendacionesGemini);

                return {
                    peliculas: [...movies, ...recomendacionesGemini.peliculas].slice(0, limite),
                    series: [...series, ...recomendacionesGemini.series].slice(0, limite),
                };
            }
        }

        return {
            peliculas: movies.map((movie) => ({
                _id: movie._id,
                title: movie.title,
                gender: movie.gender,
                year: movie.year,
                imageUrl: movie.imageUrl,
            })),
            series: series.map((serie) => ({
                _id: serie._id,
                title: serie.title,
                gender: serie.gender,
                seasons: serie.seasons,
                imageUrl: serie.imageUrl,
            })),
        };
    } catch (error) {
        console.error("Error al obtener recomendaciones de MongoDB o Gemini:", error);
        return { peliculas: [], series: [] };
    } finally {
        await client.close();
    }
}

module.exports = {
    chatBot,
    recomendarPorGenero
};
