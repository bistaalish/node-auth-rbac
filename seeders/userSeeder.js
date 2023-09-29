const mongoose = require('mongoose');
const User = require('../models/User'); // Import the User model
const Role = require('../models/Role'); // Import the Role model
const bcrypt = require('bcryptjs');



// Function to seed users
const seedUsers = async () => {
    // Sample users data
const usersData = [
    {
      name: 'adminUser',
      email: 'admin@example.com',
      password: 'adminPassword123!',
      roles: [], // Assign roles here based on Role documents created in the database
    },
    {
      name: 'regularUser',
      email: 'user@example.com',
      password: 'userPassword123!',
      roles: [], // Assign roles here based on Role documents created in the database
    },
  ];
    try {
    // Clear existing users
    await User.deleteMany({});

    // Find roles by name and assign them to users
    const adminRole = await Role.findOne({ name: 'admin' });
    const userRole = await Role.findOne({ name: 'user' });
    usersData[0].roles = [adminRole._id];
    usersData[1].roles = [userRole._id];
    
    // Insert the sample users
    await User.insertMany(usersData);
    const adminUser = await User.findOne({ name: 'adminUser' })
    const regularUser = await User.findOne({  name: 'regularUser'})
    regularUser.isVerified = true;
    adminUser.isVerified = true;
    await adminUser.save()
    await regularUser.save()
    console.log(adminUser)
    console.log(regularUser)
    console.log('Users seeded successfully.');
  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    return
    // mongoose.connection.close(); // Close the database connection
  }
}

module.exports = seedUsers; // Export the seeding function
