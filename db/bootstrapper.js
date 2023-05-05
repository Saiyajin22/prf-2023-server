const mongoose = require("mongoose");
const Bicycle = require("./bicycleSchema");
const User = mongoose.model("user");
const Car = mongoose.model("car");

async function createInitialData() {
  await ensureAdminExists();
  await ensureCarsExist();
  await ensureBicyclesExist();
}

async function ensureAdminExists() {
  try {
    const admin = await User.findOne({ accessLevel: 3 });
    if (admin) {
      console.log("Admin user exists!");
    } else {
      const newAdmin = new User({
        username: "admin",
        password: "admin12345",
        accessLevel: 3,
        birthdate: new Date(),
      });
      await newAdmin.save();
      console.log("Admin user successfully created!");
    }
  } catch (error) {
    console.error("Error occured while creating the admin user: ", error);
  }
}

async function ensureCarsExist() {
  try {
    const cars = await Car.find();
    if (cars && cars.length > 0) {
      console.log("Cars already exist!");
    } else {
      const cars = [
        new Car({
          brand: "BMW",
          series: "X3",
          bodyStyle: "SUV",
          dateOfManufacturing: new Date(2006, 10, 18),
        }),
        new Car({
          brand: "Opel",
          series: "Vectra B",
          bodyStyle: "Sedan",
          dateOfManufacturing: new Date(2003, 5, 22),
        }),
      ];
      await Car.insertMany(cars);
      console.log("Cars saved successfully!");
    }
  } catch (error) {
    console.error("Error occured while creating the cars: ", error);
  }
}

async function ensureBicyclesExist() {
  try {
    const bicycles = await Bicycle.find();
    if (bicycles && bicycles.length > 0) {
      console.log("Bicycles already exist!");
    } else {
      const bicycles = [
        new Bicycle({
          brand: "Trekking",
          series: "Eska",
          bodyStyle: "Normal Men's Bike",
          frameMaterial: "Steel",
          gearType: "18 speed Elysse",
          wheelSize: 28,
          price: 150,
        }),
        new Bicycle({
          brand: "Cube",
          series: "Aim Pro",
          bodyStyle: "MTB",
          frameMaterial: "Aluminium Lite",
          gearType: "Shimano SL-M315",
          wheelSize: 29,
          price: 670,
        }),
      ];
      await Bicycle.insertMany(bicycles);
      console.log("Bicycles saved successfully!");
    }
  } catch (error) {
    console.error("Error occured while creating the bicycles: ", error);
  }
}

module.exports = createInitialData;
