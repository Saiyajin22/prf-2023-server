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

router.get("/:id", async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (car == null) {
      res.status(404).json({ message: "No car exists with the given id" });
    } else {
      res.status(200).json(car);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:brand", async (req, res) => {
  try {
    const bmwCars = await Car.find({ brand: req.params.brand });
    console.log("BMW Cars from db: ", bmwCars);
    res.status(200).json(bmwCars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  const car = new Car({
    brand: req.body.brand,
    series: req.body.series,
    bodyStyle: req.body.bodyStyle,
    dateOfManufacturing: req.body.dateOfManufacturing,
  });

  try {
    const newCar = await car.save();
    res.status(201).json(newCar);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;