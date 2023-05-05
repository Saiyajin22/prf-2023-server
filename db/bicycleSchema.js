const mongoose = require('mongoose');

const bicycleSchema = new mongoose.Schema({
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
  frameMaterial: {
    type: String,
    required: true,
  },
  gearType: {
    type: String,
    required: false,
  },
  wheelSize: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

bicycleSchema.pre('save', function(next) {
  const bicycle = this;
  if(bicycle.price > 500000){
    console.log("The most expensive bicycle costs 500.000$. Please lower your price");
    return next(error);
  }

  return next();
});

bicycleSchema.pre('find', function(next) {
    const bicycle = this;
    bicycle.where({price: { $lt: 500000 }})
});

const Bicycle = mongoose.model('bicycle', bicycleSchema);
module.exports = Bicycle;