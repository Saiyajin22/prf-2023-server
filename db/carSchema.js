const mongoose = require('mongoose');
const { carBodyStyles } = require('../models/carBodyStyles');

const carSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true,
  },
  series: {
    type: String,
    required: true,
  },
  bodyStyle: {
    type: String,
    required: true,
  },
  dateOfManufacturing: {
    type: Date,
    required: true,
  },
});

carSchema.pre('save', function(next) {
  const car = this;
  if(!carBodyStyles.includes(car.bodyStyle.toLowerCase())){
    console.log("The given body style is not valid for a car!");
    return next(error);
  }

  return next();
});

const Car = mongoose.model('car', carSchema);
module.exports = Car;