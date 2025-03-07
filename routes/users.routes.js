const express = require("express");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

const userRouter = express.Router();

userRouter.get('/:id', isAuthenticated, (req, res, next) => {
    const userId = req.params.id;

    if(req.payload._id !== userId) {
        return res.status(403).json({message:"You are not authorized to access this data"})
    }

    User.findById(userId)
    .then((user) => {
        res.status(200).json(user)
    })
    .catch((err) => {
        res.status(500).json({message: "Internal server error"})
    })
})

userRouter.put("/:id", isAuthenticated, (req, res) => {
    const userId = req.params.id;

    
    if(req.payload._id !== userId) {
        return res.status(403).json({message:"You are not authorized to access this data"})
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
  
  //DELETE STUDENT BY ID
  userRouter.delete("/:id", isAuthenticated,(req, res) => {
    const userId = req.params.id;

    
    if(req.payload._id !== userId) {
        return res.status(403).json({message:"You are not authorized to access this data"})
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

module.exports = userRouter;