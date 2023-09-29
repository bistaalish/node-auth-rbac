// isAdmin.js
const Role = require('../models/Role'); // Import the Role model

const isAdmin = async (req, res, next) => {
  try {
    // Check if the user making the request has the "admin" role
    const userRoles = req.user.roles; // Assuming you have set the user data in the request object
    // Find the "admin" role in the database
    const adminRole = await Role.findOne({ name: 'admin' });

    if (!adminRole) {
      return res.status(500).json({ error: 'Admin role not found.' });
    }

    // Check if the user's roles include the "admin" role
    if (userRoles.name !== adminRole.name) {
      return res.status(403).json({ error: 'Access denied. User is not an admin.' });
    }

    // If the user is an admin, continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error('isAdmin Middleware Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = isAdmin;
