const express = require('express');
const isAdmin = require('../middlewares/isAdmin'); // Import the "isAdmin" middleware

const router = express.Router();

router.use(isAdmin)
// Example: Protect a route using the "isAdmin" middleware
router.get('/', (req, res) => {
  res.json({ message: 'Admin Route Successful!!' });
});

module.exports = router;
