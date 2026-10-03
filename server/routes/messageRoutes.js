const express = require("express");

const {
    sendMessage,
    getMessages,
} = require("../controllers/messageController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();


// Protected routes

// Send a message
router.post(
    "/",
    authenticateToken,
    sendMessage
);


// Get all messages from a conversation
router.get(
    "/conversation/:conversationId",
    authenticateToken,
    getMessages
);


module.exports = router;