const express = require('express');
const isAdmin = require('../../middlewares/isAdmin'); // Import the "isAdmin" middleware
const {
    getAllRoles,
    getRole,
    createRole,
    updateRole,
    deleteRole,

} = require('../../controllers/role');
const router = express.Router();

// Use Admin Middle so that only admins can use this route
router.use(isAdmin)

// Example: Protect a route using the "isAdmin" middleware
router.route('/').get(getAllRoles).post(createRole);
router.route('/:id').get(getRole).patch(updateRole).delete(deleteRole)

module.exports = router;
