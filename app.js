// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");
const rateLimit = require ('express-rate-limit')

const app = express();

// Middleware para manejar JSON en el cuerpo de las solicitudes
app.use(express.json());

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);


// Middleware de limitación de solicitudes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100,
    message: "Demasiadas solicitudes, intenta más tarde."
  });

// Apply the rate limiting middleware to all requests at AI routes.
app.use("/api/ai", limiter);

// 👇 Start handling routes here
const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const usersRoutes = require("./routes/users.routes");
app.use("/auth/users", usersRoutes);

const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

const movieRoutes = require("./routes/movies.routes");
app.use("/api/movies", movieRoutes);

const serieRoutes = require("./routes/series.routes");
app.use("/api/series", serieRoutes);

const aiRoutes = require("./routes/ai.routes");
app.use("/api/ai", aiRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;