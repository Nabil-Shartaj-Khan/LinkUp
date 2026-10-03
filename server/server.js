require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const db = require("./config/database");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const conversationRoutes = require("./routes/conversationRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();

const PORT = process.env.PORT || 5000;


// middleware
app.use(
    cors({
        origin: "http://localhost:3000",
        methods: [
            "GET",
            "POST",
            "PUT",
            "DELETE",
            "PATCH",
        ],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
        ],
    })
);

app.use(express.json());


// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);


// basic api test route
app.get("/", (req, res) => {
    res.json({
        message: "LinkUp API is running",
    });
});


// database connection test route
app.get("/api/test-db", async (req, res) => {
    try {
        const [result] = await db.query(
            "SELECT DATABASE() AS databaseName, NOW() AS currentTime"
        );

        res.json({
            success: true,
            message: "Connected to MySQL successfully",
            database: result[0].databaseName,
            time: result[0].currentTime,
        });

    } catch (error) {

        console.error(
            "database error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to connect to MySQL",
        });
    }
});


// create http server
const server = http.createServer(app);


// create socket.io server
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});


// make socket.io available inside controllers
app.set("io", io);


// track connected sockets for each user
const connectedUsers = new Map();


// authenticate socket connection
io.use((socket, next) => {
    try {

        const token =
            socket.handshake.auth.token;


        if (!token) {

            return next(
                new Error(
                    "Authentication required"
                )
            );
        }


        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );


        // store authenticated user id
        socket.userId =
            decoded.userId;


        next();

    } catch (error) {

        next(
            new Error(
                "Invalid or expired token"
            )
        );
    }
});


// socket.io connection
io.on("connection", async (socket) => {

    const userId =
        Number(socket.userId);


    console.log(
        `user ${userId} connected with socket ${socket.id}`
    );


    // join personal user room
    socket.join(
        `user:${userId}`
    );


    // track this user's socket
    const userSockets =
        connectedUsers.get(userId) ||
        new Set();


    userSockets.add(
        socket.id
    );


    connectedUsers.set(
        userId,
        userSockets
    );


    try {

        // mark user online
        await db.query(
            `UPDATE users
            SET is_online = TRUE
            WHERE id = ?`,
            [userId]
        );


        // notify connected clients
        io.emit(
            "user_presence",
            {
                userId,
                isOnline: true,
                lastSeen: null,
            }
        );


        // get conversations the user belongs to
        const [memberships] =
            await db.query(
                `SELECT conversation_id
                FROM conversation_members
                WHERE user_id = ?`,
                [userId]
            );


        // join existing conversation rooms
        memberships.forEach(
            (membership) => {

                const roomName =
                    `conversation:${membership.conversation_id}`;


                socket.join(
                    roomName
                );


                console.log(
                    `user ${userId} joined ${roomName}`
                );
            }
        );

    } catch (error) {

        console.error(
            "socket connection setup error:",
            error
        );
    }


    // dynamically join conversation
    socket.on(
        "join_conversation",
        async (conversationId) => {

            try {

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


                if (
                    memberships.length === 0
                ) {

                    console.log(
                        `user ${userId} cannot join conversation:${conversationId}`
                    );

                    return;
                }


                const roomName =
                    `conversation:${conversationId}`;


                socket.join(
                    roomName
                );


                console.log(
                    `user ${userId} dynamically joined ${roomName}`
                );

            } catch (error) {

                console.error(
                    "dynamic conversation join error:",
                    error
                );
            }
        }
    );
// handle typing start
socket.on(
    "typing_start",
    async (conversationId) => {

        try {

            // verify conversation membership
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
                return;
            }


            // notify other users in the conversation
            socket
                .to(`conversation:${conversationId}`)
                .emit(
                    "user_typing",
                    {
                        conversationId:
                            Number(conversationId),

                        userId,
                        isTyping: true,
                    }
                );

        } catch (error) {

            console.error(
                "typing start error:",
                error
            );
        }
    }
);


// handle typing stop
socket.on(
    "typing_stop",
    async (conversationId) => {

        try {

            // verify conversation membership
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
                return;
            }


            // notify other users in the conversation
            socket
                .to(`conversation:${conversationId}`)
                .emit(
                    "user_typing",
                    {
                        conversationId:
                            Number(conversationId),

                        userId,
                        isTyping: false,
                    }
                );

        } catch (error) {

            console.error(
                "typing stop error:",
                error
            );
        }
    }
);

    // handle socket disconnect
    socket.on(
        "disconnect",
        async () => {

            console.log(
                `user ${userId} disconnected`
            );


            const userSockets =
                connectedUsers.get(userId);


            if (userSockets) {

                userSockets.delete(
                    socket.id
                );


                if (
                    userSockets.size > 0
                ) {

                    connectedUsers.set(
                        userId,
                        userSockets
                    );

                    return;
                }


                connectedUsers.delete(
                    userId
                );
            }


            try {

                const lastSeen =
                    new Date();


                // mark user offline
                await db.query(
                    `UPDATE users
                    SET
                        is_online = FALSE,
                        last_seen = ?
                    WHERE id = ?`,
                    [
                        lastSeen,
                        userId
                    ]
                );


                // notify connected clients
                io.emit(
                    "user_presence",
                    {
                        userId,
                        isOnline: false,
                        lastSeen,
                    }
                );

            } catch (error) {

                console.error(
                    "user disconnect update error:",
                    error
                );
            }
        }
    );
});


// start server
server.listen(PORT, () => {

    console.log(
        `LinkUp server running on http://localhost:${PORT}`
    );
});