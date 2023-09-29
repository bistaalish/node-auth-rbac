const mongoose = require('mongoose');
const Role = require('../models/Role'); // Import the Role model
require('dotenv').config();
const connectDB = require('../db/connect');



// Function to seed roles
const seedRoles = async  () => {
  // Sample roles data
const rolesData = [
  {
    name: 'admin',
    description: 'Administrator role',
    permissions: ['read', 'write', 'delete'],
  },
  {
    name: 'user',
    description: 'Regular user role',
    permissions: ['read'],
  },
];
  try {
    // Clear existing roles
    await  mongoose.connect(process.env.MONGO_URI)
    await Role.deleteMany({});
    // Insert the sample roles
    await Role.insertMany(rolesData);

    console.log('Roles seeded successfully.');
  } catch (error) {
    console.error('Error seeding roles:', error);
  } finally {
    return
    // mongoose.connection.close(); // Close the database connection
  }
}

module.exports = seedRoles; // Call the seeding function
