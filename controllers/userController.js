const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("user");
const passport = require("passport");

router.route("/register").post(async (req, res, next) => {
  if ((req.body.username, req.body.password)) {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
      accessLevel: 1,
      birthdate: req.body.birthdate,
    });
    try {
      const newUser = await user.save();
      res.status(201).json(newUser);
      console.log("User created successfully");
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  } else {
    return res.status(400).json("Username or password were not provided!");
  }
});

router.route("/login").post((req, res, next) => {
  if ((req.body.username, req.body.password)) {
    passport.authenticate("local", function (error, user) {
      if (error)
        return res.status(500).json("Login failed due to an unexpected error");
      req.login(user, function (error) {
        if (error)
          return res
            .status(500)
            .json("Login failed due to an unexpected error");
        return res.status(200).json("Successfully logged in!");
      });
    })(req, res);
  } else {
    return res.status(400).json("Username or password were not provided!");
  }
});

router.route("/logout").post((req, res, next) => {
  if (req.isAuthenticated()) {
    req.logout((error) => {
      if (error) {
        return next(error);
      }
      console.log("Successfully logged out");
      return res.status(200).json({
        message: "Successfully logged out",
        httpStatus: "OK",
        httpStatusNumber: 200,
      });
    });
  } else {
    return res.status(403).json({
      message: "Logout failed. User is not logged in.",
      httpStatus: "FORBIDDEN",
      httpStatusNumber: 403,
    });
  }
});

router.route("/status").get((req, res, next) => {
  if (req.isAuthenticated()) {
    console.log(req.user);
    return res.status(200).send({
      message: "User is logged in",
      httpStatus: "OK",
      httpStatusNumber: 200,
      data: req.user,
    });
  } else {
    return res.status(403).send({
      message: "User is not logged in",
      httpStatus: "FORBIDDEN",
      httpStatusNumber: 403,
    });
  }
});

router.route("/authenticated").get((req, res, next) => {
  console.log("/authenticated endpoint called");
  if (req.isAuthenticated()) {
    return res.status(200).send(true);
  } else {
    return res.status(403).send(false);
  }
});

async function getUser(req, res, next) {
  try {
    user = await User.findById(req.params.id);
    if (user == null) {
      return res
        .status(404)
        .json({ message: "There is no user with the given id" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }

  res.user = user;
  next();
}

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({
      message: "Succesful User Query",
      httpStatus: "OK",
      httpStatusNumber: 200,
      dataArray: users,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unexpected Error while query users",
      httpStatus: "ERROR",
      httpStatusNumber: 500,
      dataArray: [],
    });
  }
});

router.get("/:id", getUser, (req, res) => {
  res.json(res.user);
});

router.post("/create", async (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
    accessLevel: req.body.accessLevel,
    birthdate: req.body.birthdate,
  });

  try {
    const newUser = await user.save();
    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.patch("/update/:id", getUser, async (req, res) => {
  if (req.body.username != null) {
    res.user.username = req.body.username;
  }
  if (req.body.password != null) {
    res.user.password = req.body.password;
  }
  if (req.body.accessLevel != null) {
    res.user.accessLevel = req.body.accessLevel;
  }
  if (req.body.birthdate != null) {
    res.user.birthdate = req.body.birthdate;
  }

  try {
    const updatedUser = await res.user.save();
    return res.json(updatedUser);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", getUser, async (req, res) => {
  try {
    await res.user.remove();
    res.json({ message: "User successfully deleted!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
