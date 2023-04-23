const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Car = mongoose.model("car");

router.get("/", async (req, res) => {
  try {
    const cars = await Car.find();
    console.log("Cars from db: ", cars);
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;