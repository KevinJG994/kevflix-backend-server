const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function chatBot(prompt) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        console.log("Enviando prompt a Gemini:", prompt);
        const result = await model.generateContent(prompt);
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
        throw new Error("Error al generar la respuesta del chatbot.");
    }
}

module.exports = {
    chatBot
};