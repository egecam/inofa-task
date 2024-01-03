const mongoose = require("mongoose");

// userdata collection icin gerekli schema
const userSchema = new mongoose.Schema({
  name: String,
  surname: String,
  email: String,
  password: String,
});

// schema ile user modeli
const User = mongoose.model("User", userSchema);

module.exports = User;
