const express = require("express");

const {
    updateProfile,
    searchUsers,
} = require("../controllers/userController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();


// Protected routes
router.put("/profile", authenticateToken, updateProfile);

router.get("/search", authenticateToken, searchUsers);


module.exports = router;