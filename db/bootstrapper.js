const mongoose = require('mongoose');
const User = mongoose.model('user');

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
    console.error('Error occured while creating the admin user ', error);
  }
}

module.exports = ensureAdminExists;