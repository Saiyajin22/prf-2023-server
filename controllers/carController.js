const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Car = mongoose.model("car");
const ObjectId = mongoose.Types.ObjectId;

function getCarById(id) {
  const carFromDB = Car.findById(id);
  if (carFromDB) {
    return carFromDB;
  }

  return null;
}

router.get("/", async (req, res) => {
  try {
    const cars = await Car.find();
    const carsWithId = cars.map((car) => {
      return {
        id: car._id.toString(),
        brand: car.brand,
        series: car.series,
        bodyStyle: car.bodyStyle,
        dateOfManufacturing: car.dateOfManufacturing,
      };
    });
    res.status(200).json(carsWithId);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const carId = ObjectId(req.params.id);
    const car = await Car.findById(carId);
    if (!car) {
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

router.post("/create", async (req, res) => {
  const car = new Car({
    brand: req.body.brand,
    series: req.body.series,
    bodyStyle: req.body.bodyStyle,
    dateOfManufacturing: req.body.dateOfManufacturing,
  });

  try {
    const newCar = await car.save();
    return res.status(201).json({
      message: "Car created successfully.",
      httpStatus: "Created success",
      httpStatusNumber: 201,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
      httpStatus: "Bad request",
      httpStatusNumber: 400,
    });
  }
});

router.patch("/update/:id", async (req, res) => {
  const carFromDB = Car.findById(req.params.id);
  if (carFromDB) {
    if (req.body.brand != null) {
      carFromDB.brand = req.body.brand;
    }
    if (req.body.series != null) {
      carFromDB.series = req.body.series;
    }
    if (req.body.bodyStyle != null) {
      carFromDB.bodyStyle = req.body.bodyStyle;
    }
    if (req.body.dateOfManufacturing != null) {
      carFromDB.dateOfManufacturing = req.body.dateOfManufacturing;
    }
  }

  try {
    const updatedCar = await carFromDB.save();
    res.status(201).json(newCar);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const carId = ObjectId(req.params.id);
    await Car.deleteOne({
      _id: carId,
    });
    return res.json({
      message: "Car deleted successfully.",
      httpStatus: "OK",
      httpStatusNumber: 200,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Could not delete car.",
      httpStatus: "ERROR",
      httpStatusNumber: 500,
    });
  }
});

module.exports = router;
