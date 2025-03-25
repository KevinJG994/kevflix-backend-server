const express = require("express");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const userRouter = express.Router();
const Movies = require("../models/Movie.model");
const Series = require("../models/Serie.model");

// GET User by ID: /auth/users/:id
userRouter.get('/:id', isAuthenticated, (req, res, next) => {
    const userId = req.params.id;

    if (req.payload._id !== userId) {
        return res.status(403).json({ message: "You are not authorized to access this data" })
    }

    User.findById(userId)
        .then((user) => {
            res.status(200).json(user)
        })
        .catch((err) => {
            res.status(500).json({ message: "Internal server error" })
        })
})


// UPDATE User by ID: /auth/users/:id
userRouter.put("/:id", isAuthenticated, (req, res) => {
    const userId = req.params.id;


    if (req.payload._id !== userId) {
        return res.status(403).json({ message: "You are not authorized to access this data" })
    }

    User.findByIdAndUpdate(userId, req.body, { new: true })
        .then((updatedProfile) => {
            console.log("Retrieved user ->", updatedProfile);

            res.status(204).json(updatedProfile);
        })
        .catch((err) => {
            console.error(err, "Error to update user");
            res.status(500).json({ error: "Failed to update user" + err });
        });
});


// DELETE User by ID: /auth/users/:id
userRouter.delete("/:id", isAuthenticated, (req, res) => {
    const userId = req.params.id;


    if (req.payload._id !== userId) {
        return res.status(403).json({ message: "You are not authorized to access this data" })
    }

    User.findByIdAndDelete(userId)
        .then((result) => {
            console.log("User deleted!");

            res.status(204).send(); // Send back only status code 204 indicating that resource is deleted
        })

        .catch((error) => {
            console.error("Error while deleting the User ->", error);

            res.status(500).json({ error: "Deleting User failed" });
        });
});


// Get All Favourite Movies: /auth/users/:userId/favouritesMovies
userRouter.get("/:userId/favouritesMovies", async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).populate("favouriteMovie");

        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

        res.status(200).json(user.favouriteMovie);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener favoritos", error });
    }
});


// Add Favourite by MovieID: /auth/users/:userId/favouriteMovie/:movieId
userRouter.post("/:userId/favouriteMovie/:movieId", async (req, res) => {
    try {
        const { userId, movieId } = req.params;

        console.log("User ID recibido:", userId);
        console.log("Movie ID recibido:", movieId);

        // Verificar si el usuario existe
        const user = await User.findById(userId);
        if (!user) {
            console.log("Usuario no encontrado");
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        console.log("Usuario encontrado:", user);

        // Verificar si la película existe
        const movie = await Movies.findById(movieId);
        if (!movie) {
            console.log("Película no encontrada");
            return res.status(404).json({ message: "Película no encontrada" });
        }

        console.log("Película encontrada:", movie);

        // Evitar duplicados en favoritos
        if (!user.favouriteMovie.includes(movieId)) {
            console.log("Agregando película a favoritos...");
            user.favouriteMovie.push(movieId);
            await user.save();
        } else {
            console.log("La película ya está en favoritos");
        }

        res.status(200).json({ message: "Película agregada a favoritos", favouriteMovie: user.favouriteMovie });
    } catch (error) {
        console.error("Error al agregar a favoritos:", error);
        res.status(500).json({ message: "Error al agregar a favoritos", error });
    }
});


// DELETE Favourite by MovieID: /auth/users/:userId/favouriteMovie/:movieId
userRouter.delete("/:userId/favouriteMovie/:movieId", async (req, res) => {
    try {
        const { userId, movieId } = req.params;

        console.log("User ID recibido:", userId);
        console.log("Movie ID recibido:", movieId);

        // Verificar si el usuario existe
        const user = await User.findById(userId);
        if (!user) {
            console.log("Usuario no encontrado");
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        console.log("Usuario encontrado:", user);

        // Verificar si la película está en favoritos
        if (user.favouriteMovie.includes(movieId)) {
            console.log("Eliminando película de favoritos...");
            user.favouriteMovie = user.favouriteMovie.filter((fav) => fav.toString() !== movieId);
            await user.save();
        } else {
            console.log("La película no está en favoritos");
            return res.status(404).json({ message: "La película no está en favoritos" });
        }

        res.status(200).json({ message: "Película eliminada de favoritos", favouriteMovie: user.favouriteMovie });
    } catch (error) {
        console.error("Error al eliminar de favoritos:", error);
        res.status(500).json({ message: "Error al eliminar de favoritos", error });
    }
});


// Get All Favourite Series: /auth/users/:userId/favouriteSeries
userRouter.get("/:userId/favouriteSeries", async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).populate("favouriteSerie");

        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

        res.status(200).json(user.favouriteSerie);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener favoritos", error });
    }
});


// Add Favourite by SerieID: /auth/users/:userId/favouriteSerie/:serieId
userRouter.post("/:userId/favouriteSerie/:serieId", async (req, res) => {
    try {
        const { userId, serieId } = req.params;

        console.log("User ID recibido:", userId);
        console.log("Serie ID recibido:", serieId);

        // Verificar si el usuario existe
        const user = await User.findById(userId);
        if (!user) {
            console.log("Usuario no encontrado");
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        console.log("Usuario encontrado:", user);

        // Verificar si la película existe
        const serie = await Series.findById(serieId);
        if (!serie) {
            console.log("Serie no encontrada");
            return res.status(404).json({ message: "Serie no encontrada" });
        }

        console.log("Serie encontrada:", serie);

        // Evitar duplicados en favoritos
        if (!user.favouriteSerie.includes(serieId)) {
            console.log("Agregando serie a favoritos...");
            user.favouriteSerie.push(serieId);
            await user.save();
        } else {
            console.log("La serie ya está en favoritos");
        }

        res.status(200).json({ message: "Serie agregada a favoritos", favouriteSerie: user.favouriteSerie });
    } catch (error) {
        console.error("Error al agregar a favoritos:", error);
        res.status(500).json({ message: "Error al agregar a favoritos", error });
    }
});


// Delete Favourite by SerieID: /auth/users/:userId/favouriteSerie/:serieId
userRouter.delete("/:userId/favouriteSerie/:serieId", async (req, res) => {
    try {
        const { userId, serieId } = req.params;

        console.log("User ID recibido:", userId);
        console.log("Serie ID recibido:", serieId);

        // Verificar si el usuario existe
        const user = await User.findById(userId);
        if (!user) {
            console.log("Usuario no encontrado");
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        console.log("Usuario encontrado:", user);

        // Verificar si la serie está en favoritos
        if (user.favouriteSerie.includes(serieId)) {
            console.log("Eliminando serie de favoritos...");
            user.favouriteSerie = user.favouriteSerie.filter((fav) => fav.toString() !== serieId);
            await user.save();
        } else {
            console.log("La serie no está en favoritos");
            return res.status(404).json({ message: "La serie no está en favoritos" });
        }

        res.status(200).json({ message: "Serie eliminada de favoritos", favouriteSerie: user.favouriteSerie });
    } catch (error) {
        console.error("Error al eliminar de favoritos:", error);
        res.status(500).json({ message: "Error al eliminar de favoritos", error });
    }
});

module.exports = userRouter;