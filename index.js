// gerekli importlar
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const user = require("./models/user");

const app = express();
const port = 3000;

// mongoose ile MongoDB baglantisi
const uri = "mongodb://localhost:27017/userdata";
mongoose.connect(uri);

const db = mongoose.connection;
// hata halinde konsola yazdir
db.on("error", console.error.bind(console, "Database connection error:"));
db.once("open", () => {
  console.log("Connected to 'userdata' database successfully!");
});

// html form ile elde edilen veriyi parse eden middleware
app.use(bodyParser.urlencoded({ extended: true }));

// homepage donen get request
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/home.html");
});

// homepage formunun post requesti
app.post("/submit", async (req, res) => {
  try {
    // gonderilen email adresi ile kayitli kullanici kontrolu
    let findUser = await user.find({ email: req.body.email });
    if (findUser.length > 0) {
      // bulunduysa 400 dondur
      res.status(400).json({
        message: "User already exists with the email!",
        email: req.body.email,
      });
    } else {
      // kayitli kullanici bulunmadiysa yeni kullanici olustur
      const newUser = new user({
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        password: req.body.password,
      });
      // yeni kullaniciyi db'ye kaydet
      await newUser.save().then(() => {
        res
          // 201 dondur ve yeni kullaniciyi json olarak goster
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
