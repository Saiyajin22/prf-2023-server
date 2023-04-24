const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const expressSession = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require('cors');

const app = express();

mongoose.connect("mongodb://localhost:27017/prf_projekt_toth_zoltan", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB successfully!");
});

const User = require("./db/userSchema");
const Car = require("./db/carSchema");
require("./db/bootstrapper")();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

passport.use(
  "local",
  new localStrategy(function (username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) return done("Error while querying user", null);
      if (!user) return done("User does not exist", null);
      user.comparePasswords(password, function (error, isMatch) {
        if (error) return done(error, false);
        if (!isMatch) return done("Passwords does not match", false);
        return done(null, user);
      });
    });
  })
);

passport.serializeUser(function (user, done) {
  if (!user) return done("No user for login", null);
  return done(null, user);
});

passport.deserializeUser(function (user, done) {
  if (!user) return done("User is not logged in", null);
  return done(null, user);
});

app.use(
  expressSession({ secret: "prf_projekt_2023_toth_zoltan", resave: true })
);
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log("A middleware futott!");
  next();
});

app.use(cors({
  origin: 'http://localhost:4200'
}));

app.use("/users", require("./controllers/userController"));
app.use("/cars", require("./controllers/carController"));
app.use("", express.static("../client"));
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
