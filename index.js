const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const user = require("./models/user");

const app = express();
const port = 3000;

const uri = "mongodb://localhost:27017/userdata";
mongoose.connect(uri);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Database connection error:"));
db.once("open", () => {
  console.log("Connected to 'userdata' database successfully!");
});

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/home.html");
});

app.post("/submit", async (req, res) => {
  try {
    let findUser = await user.find({ email: req.body.email });
    if (findUser.length > 0) {
      res.status(400).json({
        message: "User already exists with the email!",
        email: req.body.email,
      });
    } else {
      const newUser = new user({
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        password: req.body.password,
      });
      await newUser.save().then(() => {
        res
          .status(201)
          .json({ message: "User created successfully!", user: newUser });
      });
    }
  } catch (error) {
    res.send("There was an error with your registration!");
    console.log(error);
    res.redirect("/");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}!`);
});
