const express = require('express');
const isAdmin = require('../../middlewares/isAdmin'); // Import the "isAdmin" middleware
const {
    getAllUsers, getUser, createUser
} = require('../../controllers/admin/user');

const router = express.Router();

// Use Admin Middle so that only admins can use this route
router.use(isAdmin)

router.route("/").get(getAllUsers).post(createUser)
router.route("/:id").get(getUser)

module.exports = router