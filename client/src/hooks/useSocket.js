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

        // handle new real-time message
        const handleNewMessage = (message) => {

            setMessages((previousMessages) => {

                if (
                    Number(message.conversationId) !==
                    Number(selectedConversation?.id)
                ) {
                    return previousMessages;
                }


                const messageAlreadyExists =
                    previousMessages.some(
                        (existingMessage) =>
                            Number(existingMessage.id) ===
                            Number(message.id)
                    );


                if (messageAlreadyExists) {
                    return previousMessages;
                }


                return [
                    ...previousMessages,
                    message,
                ];
            });


            // stop typing when the user's message arrives
            if (
                Number(message.conversationId) ===
                Number(selectedConversation?.id)
            ) {

                setTypingUserId((previousUserId) => {

                    if (
                        Number(previousUserId) ===
                        Number(message.sender?.id)
                    ) {
                        return null;
                    }


                    return previousUserId;
                });
            }


            // update conversation preview
            setConversations(
                (previousConversations) => {

                    const conversationExists =
                        previousConversations.some(
                            (conversation) =>
                                Number(conversation.id) ===
                                Number(message.conversationId)
                        );


                    if (!conversationExists) {
                        return previousConversations;
                    }


                    const updatedConversations =
                        previousConversations.map(
                            (conversation) => {

                                if (
                                    Number(conversation.id) ===
                                    Number(message.conversationId)
                                ) {
                                    return {
                                        ...conversation,

                                        lastMessage: {
                                            id: message.id,
                                            content:
                                                message.content,
                                            type:
                                                message.type,
                                            createdAt:
                                                message.createdAt,
                                        },
                                    };
                                }


                                return conversation;
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


        // handle deleted conversation
        const handleConversationDeleted = (
            data
        ) => {

            setConversations(
                (previousConversations) =>
                    previousConversations.filter(
                        (conversation) =>
                            Number(conversation.id) !==
                            Number(data.conversationId)
                    )
            );


            if (
                Number(selectedConversation?.id) ===
                Number(data.conversationId)
            ) {

                setSelectedConversation(null);

                setMessages([]);

                setTypingUserId(null);
            }
        };


        // handle online and offline presence
        const handleUserPresence = (data) => {

            setConversations(
                (previousConversations) =>
                    previousConversations.map(
                        (conversation) => {

                            if (
                                Number(
                                    conversation.user?.id
                                ) !==
                                Number(data.userId)
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
                            previousConversation.user?.id
                        ) !==
                        Number(data.userId)
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
        const handleUserTyping = (data) => {

            if (
                Number(data.conversationId) !==
                Number(selectedConversation?.id)
            ) {
                return;
            }


            if (data.isTyping) {

                setTypingUserId(
                    Number(data.userId)
                );

            } else {

                setTypingUserId(
                    (previousUserId) => {

                        if (
                            Number(previousUserId) ===
                            Number(data.userId)
                        ) {
                            return null;
                        }


                        return previousUserId;
                    }
                );
            }
        };


        socket.on(
            "new_message",
            handleNewMessage
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
                "new_message",
                handleNewMessage
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