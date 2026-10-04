"use client";

import { useEffect } from "react";

import socket from "@/lib/socket";


export default function useSocket({
    token,
    selectedConversation,
    setMessages,
    setConversations,
    setSelectedConversation,
    setTypingUserId,
}) {

    // connect authenticated socket
    useEffect(() => {

        if (!token) {
            return;
        }


        socket.auth = {
            token,
        };


        if (!socket.connected) {
            socket.connect();
        }


        return () => {
            socket.disconnect();
        };

    }, [token]);


    // register socket event listeners
    useEffect(() => {

        // get current logged-in user id
        const getCurrentUserId = () => {

            const storedUser =
                localStorage.getItem(
                    "linkup_user"
                );


            if (!storedUser) {
                return null;
            }


            try {

                const currentUser =
                    JSON.parse(storedUser);


                return Number(
                    currentUser.id
                );

            } catch (error) {

                console.error(
                    "stored user parse error:",
                    error
                );


                return null;
            }
        };


        // handle newly created conversation
        const handleNewConversation = (
            conversation
        ) => {

            // join the new conversation room
            socket.emit(
                "join_conversation",
                conversation.id
            );


            setConversations(
                (previousConversations) => {

                    const conversationExists =
                        previousConversations.some(
                            (existingConversation) =>
                                Number(
                                    existingConversation.id
                                ) ===
                                Number(
                                    conversation.id
                                )
                        );


                    if (conversationExists) {
                        return previousConversations;
                    }


                    return [
                        conversation,
                        ...previousConversations,
                    ];
                }
            );
        };


        // handle new real-time message
        const handleNewMessage = (message) => {

            const currentUserId =
                getCurrentUserId();


            const isReceivedMessage =
                currentUserId &&
                Number(message.sender?.id) !==
                currentUserId;


            const isConversationOpen =
                Number(message.conversationId) ===
                Number(selectedConversation?.id);


            // acknowledge message delivery
            if (isReceivedMessage) {

                socket.emit(
                    "message_delivered",
                    message.id
                );
            }


            // acknowledge message read when conversation is open
            if (
                isReceivedMessage &&
                isConversationOpen
            ) {

                socket.emit(
                    "message_read",
                    message.id
                );
            }


            setMessages(
                (previousMessages) => {

                    if (!isConversationOpen) {
                        return previousMessages;
                    }


                    const messageAlreadyExists =
                        previousMessages.some(
                            (existingMessage) =>
                                Number(
                                    existingMessage.id
                                ) ===
                                Number(
                                    message.id
                                )
                        );


                    if (messageAlreadyExists) {
                        return previousMessages;
                    }


                    return [
                        ...previousMessages,
                        message,
                    ];
                }
            );


            // stop typing when the user's message arrives
            if (isConversationOpen) {

                setTypingUserId(
                    (previousUserId) => {

                        if (
                            Number(
                                previousUserId
                            ) ===
                            Number(
                                message.sender?.id
                            )
                        ) {
                            return null;
                        }


                        return previousUserId;
                    }
                );
            }


            // update conversation preview and unread count
            setConversations(
                (previousConversations) => {

                    const conversationExists =
                        previousConversations.some(
                            (conversation) =>
                                Number(
                                    conversation.id
                                ) ===
                                Number(
                                    message.conversationId
                                )
                        );


                    if (!conversationExists) {
                        return previousConversations;
                    }


                    const updatedConversations =
                        previousConversations.map(
                            (conversation) => {

                                if (
                                    Number(
                                        conversation.id
                                    ) !==
                                    Number(
                                        message.conversationId
                                    )
                                ) {
                                    return conversation;
                                }


                                let unreadCount =
                                    Number(
                                        conversation.unreadCount ||
                                        0
                                    );


                                // increase unread count only for incoming messages
                                // when the conversation is not currently open
                                if (
                                    isReceivedMessage &&
                                    !isConversationOpen
                                ) {

                                    unreadCount += 1;
                                }


                                // open conversations have no unread messages
                                if (
                                    isReceivedMessage &&
                                    isConversationOpen
                                ) {

                                    unreadCount = 0;
                                }


                                return {
                                    ...conversation,

                                    unreadCount,

                                    lastMessage: {
                                        id:
                                            message.id,

                                        senderId:
                                            message.sender?.id,

                                        content:
                                            message.content,

                                        type:
                                            message.type,

                                        createdAt:
                                            message.createdAt,
                                    },
                                };
                            }
                        );


                    return updatedConversations.sort(
                        (
                            firstConversation,
                            secondConversation
                        ) => {

                            const firstDate =
                                firstConversation
                                    .lastMessage
                                    ?.createdAt ||
                                firstConversation
                                    .createdAt;


                            const secondDate =
                                secondConversation
                                    .lastMessage
                                    ?.createdAt ||
                                secondConversation
                                    .createdAt;


                            return (
                                new Date(secondDate) -
                                new Date(firstDate)
                            );
                        }
                    );
                }
            );
        };


        // handle message delivery update
        const handleMessageDeliveryUpdated = (
            data
        ) => {

            setMessages(
                (previousMessages) =>
                    previousMessages.map(
                        (message) => {

                            if (
                                Number(
                                    message.id
                                ) !==
                                Number(
                                    data.messageId
                                )
                            ) {
                                return message;
                            }


                            return {
                                ...message,

                                status:
                                    "delivered",

                                deliveredAt:
                                    data.deliveredAt,
                            };
                        }
                    )
            );
        };


        // handle message read update
        const handleMessageReadUpdated = (
            data
        ) => {

            setMessages(
                (previousMessages) =>
                    previousMessages.map(
                        (message) => {

                            if (
                                Number(
                                    message.id
                                ) !==
                                Number(
                                    data.messageId
                                )
                            ) {
                                return message;
                            }


                            return {
                                ...message,

                                status:
                                    "read",

                                readAt:
                                    data.readAt,
                            };
                        }
                    )
            );
        };


        // handle deleted conversation
        const handleConversationDeleted = (
            data
        ) => {

            setConversations(
                (previousConversations) =>
                    previousConversations.filter(
                        (conversation) =>
                            Number(
                                conversation.id
                            ) !==
                            Number(
                                data.conversationId
                            )
                    )
            );


            if (
                Number(
                    selectedConversation?.id
                ) ===
                Number(
                    data.conversationId
                )
            ) {

                setSelectedConversation(
                    null
                );

                setMessages([]);

                setTypingUserId(null);
            }
        };


        // handle online and offline presence
        const handleUserPresence = (
            data
        ) => {

            setConversations(
                (previousConversations) =>
                    previousConversations.map(
                        (conversation) => {

                            if (
                                Number(
                                    conversation
                                        .user?.id
                                ) !==
                                Number(
                                    data.userId
                                )
                            ) {
                                return conversation;
                            }


                            return {
                                ...conversation,

                                user: {
                                    ...conversation.user,

                                    isOnline:
                                        data.isOnline,

                                    lastSeen:
                                        data.lastSeen,
                                },
                            };
                        }
                    )
            );


            setSelectedConversation(
                (previousConversation) => {

                    if (
                        !previousConversation ||
                        Number(
                            previousConversation
                                .user?.id
                        ) !==
                        Number(
                            data.userId
                        )
                    ) {
                        return previousConversation;
                    }


                    return {
                        ...previousConversation,

                        user: {
                            ...previousConversation.user,

                            isOnline:
                                data.isOnline,

                            lastSeen:
                                data.lastSeen,
                        },
                    };
                }
            );
        };


        // handle typing indicator
        const handleUserTyping = (
            data
        ) => {

            if (
                Number(
                    data.conversationId
                ) !==
                Number(
                    selectedConversation?.id
                )
            ) {
                return;
            }


            if (data.isTyping) {

                setTypingUserId(
                    Number(
                        data.userId
                    )
                );

            } else {

                setTypingUserId(
                    (previousUserId) => {

                        if (
                            Number(
                                previousUserId
                            ) ===
                            Number(
                                data.userId
                            )
                        ) {
                            return null;
                        }


                        return previousUserId;
                    }
                );
            }
        };


        socket.on(
            "new_conversation",
            handleNewConversation
        );

        socket.on(
            "new_message",
            handleNewMessage
        );

        socket.on(
            "message_delivery_updated",
            handleMessageDeliveryUpdated
        );

        socket.on(
            "message_read_updated",
            handleMessageReadUpdated
        );

        socket.on(
            "conversation_deleted",
            handleConversationDeleted
        );

        socket.on(
            "user_presence",
            handleUserPresence
        );

        socket.on(
            "user_typing",
            handleUserTyping
        );


        return () => {

            socket.off(
                "new_conversation",
                handleNewConversation
            );

            socket.off(
                "new_message",
                handleNewMessage
            );

            socket.off(
                "message_delivery_updated",
                handleMessageDeliveryUpdated
            );

            socket.off(
                "message_read_updated",
                handleMessageReadUpdated
            );

            socket.off(
                "conversation_deleted",
                handleConversationDeleted
            );

            socket.off(
                "user_presence",
                handleUserPresence
            );

            socket.off(
                "user_typing",
                handleUserTyping
            );
        };

    }, [
        selectedConversation,
        setMessages,
        setConversations,
        setSelectedConversation,
        setTypingUserId,
    ]);
}