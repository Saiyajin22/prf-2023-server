const mongoose = require('mongoose');
const User = mongoose.model('user');
const Car = mongoose.model('car');

async function createInitialData() {
  await ensureAdminExists();
  await ensureCarsExist();
}

async function ensureAdminExists() {
  try {
    const admin = await User.findOne({ accessLevel: 3 });
    if (admin) {
      console.log('Admin user exists!');
    } else {
      const newAdmin = new User({
        username: 'admin',
        password: 'admin12345',
        accessLevel: 3,
        birthdate: new Date(),
      });
      await newAdmin.save();
      console.log('Admin user successfully created!');
    }
  } catch (error) {
    console.error('Error occured while creating the admin user: ', error);
  }
}

async function ensureCarsExist() {
  try {
    const cars = await Car.find();
    if (cars && cars.length > 0) {
      console.log('Cars already exist!');
    } else {
      const cars = [
        new Car({
          brand: 'BMW',
          series: 'X3',
          bodyStyle: 'SUV',
          dateOfManufacturing: new Date(2006, 10, 18)
        }),
        new Car({
          brand: 'Opel',
          series: 'Vectra B',
          bodyStyle: 'Sedan',
          dateOfManufacturing: new Date(2003, 5, 22)
        })
      ];
      await cars.save();
      console.log('Cars saved successfully!');
    }
  } catch (error) {
    console.error('Error occured while creating the cars: ', error);
  }
}

module.exports = createInitialData;