const db = require("../config/database");


// create or get direct conversation
const createDirectConversation = async (req, res) => {

    let connection;


    try {

        const { userId } = req.body;

        const currentUserId = req.userId;


        // check if target user id was provided
        if (!userId) {

            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }


        // prevent users from starting a conversation with themselves
        if (
            Number(userId) ===
            Number(currentUserId)
        ) {

            return res.status(400).json({
                success: false,
                message: "You cannot start a conversation with yourself",
            });
        }


        // get a database connection from the pool
        connection =
            await db.getConnection();


        // start transaction
        await connection.beginTransaction();


        // check if target user exists
        const [targetUsers] =
            await connection.query(
                `SELECT
                    id,
                    username,
                    display_name,
                    profile_picture,
                    bio,
                    is_online,
                    last_seen
                FROM users
                WHERE id = ?`,
                [userId]
            );


        if (targetUsers.length === 0) {

            await connection.rollback();


            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }


        const targetUser =
            targetUsers[0];


        // check if a direct conversation already exists
        const [existingConversations] =
            await connection.query(
                `SELECT c.id
                FROM conversations c

                INNER JOIN conversation_members cm1
                    ON cm1.conversation_id = c.id
                    AND cm1.user_id = ?

                INNER JOIN conversation_members cm2
                    ON cm2.conversation_id = c.id
                    AND cm2.user_id = ?

                WHERE c.type = 'direct'

                AND (
                    SELECT COUNT(*)
                    FROM conversation_members cm3
                    WHERE cm3.conversation_id = c.id
                ) = 2

                LIMIT 1`,
                [
                    currentUserId,
                    userId
                ]
            );


        // return existing conversation instead of creating a duplicate
        if (
            existingConversations.length > 0
        ) {

            await connection.commit();


            return res.status(200).json({
                success: true,
                message:
                    "Conversation already exists",

                conversation: {
                    id:
                        existingConversations[0].id,

                    type: "direct",

                    user: {
                        id:
                            targetUser.id,

                        username:
                            targetUser.username,

                        displayName:
                            targetUser.display_name,

                        profilePicture:
                            targetUser.profile_picture,

                        bio:
                            targetUser.bio,

                        isOnline:
                            targetUser.is_online,

                        lastSeen:
                            targetUser.last_seen,
                    },

                    lastMessage: null,

                    unreadCount: 0,
                },
            });
        }


        // get current user for the other participant's sidebar
        const [currentUsers] =
            await connection.query(
                `SELECT
                    id,
                    username,
                    display_name,
                    profile_picture,
                    bio,
                    is_online,
                    last_seen
                FROM users
                WHERE id = ?`,
                [currentUserId]
            );


        if (currentUsers.length === 0) {

            await connection.rollback();


            return res.status(404).json({
                success: false,
                message: "Current user not found",
            });
        }


        const currentUser =
            currentUsers[0];


        // create conversation
        const [conversationResult] =
            await connection.query(
                `INSERT INTO conversations
                (type, created_by)
                VALUES ('direct', ?)`,
                [currentUserId]
            );


        const conversationId =
            conversationResult.insertId;


        // add both users as conversation members
        await connection.query(
            `INSERT INTO conversation_members
            (conversation_id, user_id, role)
            VALUES
            (?, ?, 'member'),
            (?, ?, 'member')`,
            [
                conversationId,
                currentUserId,
                conversationId,
                userId
            ]
        );


        // everything succeeded
        await connection.commit();


        const creatorConversation = {
            id:
                conversationId,

            type:
                "direct",

            user: {
                id:
                    targetUser.id,

                username:
                    targetUser.username,

                displayName:
                    targetUser.display_name,

                profilePicture:
                    targetUser.profile_picture,

                bio:
                    targetUser.bio,

                isOnline:
                    targetUser.is_online,

                lastSeen:
                    targetUser.last_seen,
            },

            lastMessage: null,

            unreadCount: 0,
        };


        const recipientConversation = {
            id:
                conversationId,

            type:
                "direct",

            user: {
                id:
                    currentUser.id,

                username:
                    currentUser.username,

                displayName:
                    currentUser.display_name,

                profilePicture:
                    currentUser.profile_picture,

                bio:
                    currentUser.bio,

                isOnline:
                    currentUser.is_online,

                lastSeen:
                    currentUser.last_seen,
            },

            lastMessage: null,

            unreadCount: 0,
        };


        // notify the other user about the new conversation
        const io =
            req.app.get("io");


        io.to(
            `user:${Number(userId)}`
        ).emit(
            "new_conversation",
            recipientConversation
        );


        return res.status(201).json({
            success: true,
            message:
                "Conversation created successfully",

            conversation:
                creatorConversation,
        });


    } catch (error) {

        if (connection) {

            await connection.rollback();
        }


        console.error(
            "create conversation error:",
            error
        );


        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });


    } finally {

        if (connection) {

            connection.release();
        }
    }
};


// get user conversations
const getConversations = async (req, res) => {

    try {

        const userId = req.userId;


        const [conversations] =
            await db.query(
                `SELECT
                    c.id,
                    c.type,
                    c.name,
                    c.group_picture,
                    c.created_at,
                    c.updated_at,

                    u.id AS other_user_id,
                    u.username AS other_username,
                    u.display_name AS other_display_name,
                    u.profile_picture AS other_profile_picture,
                    u.bio AS other_bio,
                    u.is_online AS other_is_online,
                    u.last_seen AS other_last_seen,

                    lm.id AS last_message_id,
                    lm.sender_id AS last_message_sender_id,
                    lm.content AS last_message_content,
                    lm.message_type AS last_message_type,
                    lm.created_at AS last_message_created_at,

                    (
                        SELECT COUNT(*)

                        FROM message_receipts mr

                        INNER JOIN messages unread_message
                            ON unread_message.id =
                                mr.message_id

                        WHERE
                            unread_message.conversation_id =
                                c.id

                        AND mr.user_id = ?

                        AND mr.read_at IS NULL
                    ) AS unread_count

                FROM conversations c

                INNER JOIN conversation_members my_membership
                    ON my_membership.conversation_id =
                        c.id

                    AND my_membership.user_id = ?

                LEFT JOIN conversation_members other_membership
                    ON other_membership.conversation_id =
                        c.id

                    AND other_membership.user_id != ?

                LEFT JOIN users u
                    ON u.id =
                        other_membership.user_id

                LEFT JOIN messages lm
                    ON lm.id = (
                        SELECT m.id

                        FROM messages m

                        WHERE m.conversation_id =
                            c.id

                        ORDER BY
                            m.created_at DESC,
                            m.id DESC

                        LIMIT 1
                    )

                WHERE c.type = 'direct'

                ORDER BY
                    COALESCE(
                        lm.created_at,
                        c.created_at
                    ) DESC`,
                [
                    userId,
                    userId,
                    userId
                ]
            );


        const formattedConversations =
            conversations.map(
                (conversation) => ({

                    id:
                        conversation.id,

                    type:
                        conversation.type,

                    user: {
                        id:
                            conversation.other_user_id,

                        username:
                            conversation.other_username,

                        displayName:
                            conversation.other_display_name,

                        profilePicture:
                            conversation.other_profile_picture,

                        bio:
                            conversation.other_bio,

                        isOnline:
                            conversation.other_is_online,

                        lastSeen:
                            conversation.other_last_seen,
                    },

                    lastMessage:
                        conversation.last_message_id
                            ? {
                                id:
                                    conversation.last_message_id,

                                senderId:
                                    conversation.last_message_sender_id,

                                content:
                                    conversation.last_message_content,

                                type:
                                    conversation.last_message_type,

                                createdAt:
                                    conversation.last_message_created_at,
                            }
                            : null,

                    unreadCount:
                        Number(
                            conversation.unread_count
                        ),

                    createdAt:
                        conversation.created_at,

                    updatedAt:
                        conversation.updated_at,
                })
            );


        return res.status(200).json({
            success: true,
            conversations:
                formattedConversations,
        });


    } catch (error) {

        console.error(
            "get conversations error:",
            error
        );


        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};


// delete conversation
const deleteConversation = async (
    req,
    res
) => {

    try {

        const conversationId =
            req.params.conversationId;

        const userId =
            req.userId;


        // check if the user belongs to the conversation
        const [memberships] =
            await db.query(
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
                message:
                    "You are not a member of this conversation",
            });
        }


        // delete conversation
        await db.query(
            `DELETE FROM conversations
            WHERE id = ?`,
            [conversationId]
        );


        // notify connected users
        const io =
            req.app.get("io");


        io.to(
            `conversation:${conversationId}`
        ).emit(
            "conversation_deleted",
            {
                conversationId:
                    Number(
                        conversationId
                    ),
            }
        );


        return res.status(200).json({
            success: true,
            message:
                "Conversation deleted successfully",
        });


    } catch (error) {

        console.error(
            "delete conversation error:",
            error
        );


        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
    }
};


module.exports = {
    createDirectConversation,
    getConversations,
    deleteConversation,
};