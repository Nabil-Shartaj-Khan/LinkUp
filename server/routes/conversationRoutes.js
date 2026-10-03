const express = require("express");

const {
    createDirectConversation,
    getConversations,
    deleteConversation,
} = require("../controllers/conversationController");

const authenticateToken = require(
    "../middleware/authMiddleware"
);

const router = express.Router();


// get logged-in user's conversations
router.get(
    "/",
    authenticateToken,
    getConversations
);


// create or get direct conversation
router.post(
    "/direct",
    authenticateToken,
    createDirectConversation
);


// delete conversation
router.delete(
    "/:conversationId",
    authenticateToken,
    deleteConversation
);


module.exports = router;