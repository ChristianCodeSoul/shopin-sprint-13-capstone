const express = require("express");

const {
    getUsers,
    getUserById,
    getMyProfile,
    updateMyProfile,
    changePassword,
    deleteUser,
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getUsers);

router.get("/me", protect, getMyProfile);

router.put("/me", protect, updateMyProfile);

router.put("/me/password", protect, changePassword);

router.get("/:id", getUserById);

router.delete("/:id", deleteUser);

module.exports = router;