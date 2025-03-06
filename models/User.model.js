const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    image: {
      type: String,
      default: "./assets/images/profile-img.jpg",
    },
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },

  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: { createdAt: false, updatedAt: true },
  }
);

const User = model("User", userSchema);

module.exports = User;
