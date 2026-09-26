const bcrypt = require("bcryptjs");
const User = require("../models/User");

const getUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("-passwordHash")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (error) {
        console.error("Get users error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch users",
        });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-passwordHash");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Invalid user ID",
        });
    }
};

const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-passwordHash");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        console.error("Get profile error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch profile",
        });
    }
};

const updateMyProfile = async (req, res) => {
    try {
        const { firstName, lastName, email, profileImage } = req.body;

        if (!firstName || !lastName || !email) {
            return res.status(400).json({
                success: false,
                message: "First name, last name and email are required",
            });
        }

        const emailExists = await User.findOne({
            email: email.toLowerCase(),
            _id: { $ne: req.user.userId },
        });

        if (emailExists) {
            return res.status(409).json({
                success: false,
                message: "Email already exists",
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.toLowerCase().trim(),
                profileImage: profileImage || "",
            },
            {
                new: true,
                runValidators: true,
            }
        ).select("-passwordHash");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: user,
        });
    } catch (error) {
        console.error("Update profile error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update profile",
        });
    }
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Current password and new password are required",
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: "New password must contain at least 8 characters",
            });
        }

        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const passwordMatches = await bcrypt.compare(
            currentPassword,
            user.passwordHash
        );

        if (!passwordMatches) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect",
            });
        }

        user.passwordHash = await bcrypt.hash(newPassword, 12);

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });
    } catch (error) {
        console.error("Change password error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update password",
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to delete user",
        });
    }
};

module.exports = {
    getUsers,
    getUserById,
    getMyProfile,
    updateMyProfile,
    changePassword,
    deleteUser,
};