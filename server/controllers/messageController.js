const db = require("../config/database");


// send message
const sendMessage = async (req, res) => {
    try {
        const { conversationId, content } = req.body;

        const senderId = req.userId;

        // check required fields
        if (!conversationId || !content || !content.trim()) {
            return res.status(400).json({
                success: false,
                message: "Conversation ID and message content are required",
            });
        }

        // check if the logged-in user belongs to this conversation
        const [memberships] = await db.query(
            `SELECT id
            FROM conversation_members
            WHERE conversation_id = ?
            AND user_id = ?`,
            [
                conversationId,
                senderId
            ]
        );

        if (memberships.length === 0) {
            return res.status(403).json({
                success: false,
                message: "You are not a member of this conversation",
            });
        }

        // save message
        const [result] = await db.query(
            `INSERT INTO messages
            (
                conversation_id,
                sender_id,
                message_type,
                content
            )
            VALUES (?, ?, 'text', ?)`,
            [
                conversationId,
                senderId,
                content.trim()
            ]
        );

        // get the newly created message
        const [messages] = await db.query(
            `SELECT
                m.id,
                m.conversation_id,
                m.sender_id,
                m.message_type,
                m.content,
                m.file_url,
                m.reply_to_id,
                m.is_edited,
                m.edited_at,
                m.created_at,

                u.username,
                u.display_name,
                u.profile_picture

            FROM messages m

            INNER JOIN users u
                ON u.id = m.sender_id

            WHERE m.id = ?`,
            [result.insertId]
        );

        const message = messages[0];


        // format message response
        const formattedMessage = {
            id: message.id,
            conversationId: message.conversation_id,
            type: message.message_type,
            content: message.content,
            fileUrl: message.file_url,
            replyToId: message.reply_to_id,
            isEdited: message.is_edited,
            editedAt: message.edited_at,
            createdAt: message.created_at,

            sender: {
                id: message.sender_id,
                username: message.username,
                displayName: message.display_name,
                profilePicture: message.profile_picture,
            },
        };


        // get socket.io instance
        const io = req.app.get("io");


        // send message to everyone inside the conversation room
        io.to(`conversation:${conversationId}`).emit(
            "new_message",
            formattedMessage
        );


        return res.status(201).json({
            success: true,
            message: "Message sent successfully",
            data: formattedMessage,
        });

    } catch (error) {
        console.error("send message error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};


// get conversation messages
const getMessages = async (req, res) => {
    try {
        const conversationId = req.params.conversationId;

        const userId = req.userId;

        // check if the logged-in user belongs to this conversation
        const [memberships] = await db.query(
            `SELECT id
            FROM conversation_members
            WHERE conversation_id = ?
            AND user_id = ?`,
            [
                conversationId,
                userId
            ]
        );

        if (memberships.length === 0) {
            return res.status(403).json({
                success: false,
                message: "You are not a member of this conversation",
            });
        }

        // get messages from the conversation
        const [messages] = await db.query(
            `SELECT
                m.id,
                m.conversation_id,
                m.sender_id,
                m.message_type,
                m.content,
                m.file_url,
                m.reply_to_id,
                m.is_edited,
                m.edited_at,
                m.created_at,

                u.username,
                u.display_name,
                u.profile_picture

            FROM messages m

            INNER JOIN users u
                ON u.id = m.sender_id

            WHERE m.conversation_id = ?

            ORDER BY m.created_at ASC, m.id ASC`,
            [conversationId]
        );

        // format messages
        const formattedMessages = messages.map((message) => ({
            id: message.id,
            conversationId: message.conversation_id,
            type: message.message_type,
            content: message.content,
            fileUrl: message.file_url,
            replyToId: message.reply_to_id,
            isEdited: message.is_edited,
            editedAt: message.edited_at,
            createdAt: message.created_at,

            sender: {
                id: message.sender_id,
                username: message.username,
                displayName: message.display_name,
                profilePicture: message.profile_picture,
            },
        }));


        return res.status(200).json({
            success: true,
            messages: formattedMessages,
        });

    } catch (error) {
        console.error("get messages error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};


module.exports = {
    sendMessage,
    getMessages,
};