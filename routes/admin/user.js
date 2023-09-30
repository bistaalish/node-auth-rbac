const express = require('express');
const isAdmin = require('../../middlewares/isAdmin'); // Import the "isAdmin" middleware
const {
    getAllUsers, getUser, createUser, deleteUser, updateUser, changePassword
} = require('../../controllers/admin/user');

const router = express.Router();

// Use Admin Middle so that only admins can use this route
router.use(isAdmin)

router.route("/").get(getAllUsers).post(createUser)
router.route("/:id").get(getUser).delete(deleteUser).patch(updateUser)
router.post("/:id/change-password",changePassword)

module.exports = router