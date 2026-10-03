"use client";

import { useEffect, useState } from "react";

import api from "@/lib/api";
import socket from "@/lib/socket";

import useAuth from "@/hooks/useAuth";
import useSocket from "@/hooks/useSocket";

import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatHeader from "@/components/chat/ChatHeader";
import MessageList from "@/components/chat/MessageList";
import MessageInput from "@/components/chat/MessageInput";


export default function ChatPage() {

    const {
        currentUser,
        authLoading,
        getToken,
        logout,
    } = useAuth();


    const [conversations, setConversations] =
        useState([]);

    const [
        selectedConversation,
        setSelectedConversation,
    ] = useState(null);

    const [messages, setMessages] =
        useState([]);

    const [messageText, setMessageText] =
        useState("");

    const [searchText, setSearchText] =
        useState("");

    const [searchResults, setSearchResults] =
        useState([]);

    const [searching, setSearching] =
        useState(false);

    const [
        conversationsLoading,
        setConversationsLoading,
    ] = useState(true);

    const [
        messagesLoading,
        setMessagesLoading,
    ] = useState(false);

    const [error, setError] =
        useState("");

    const [
        typingUserId,
        setTypingUserId,
    ] = useState(null);


    const token = getToken();


    // connect socket and register listeners
    useSocket({
        token,
        selectedConversation,
        setMessages,
        setConversations,
        setSelectedConversation,
        setTypingUserId,
    });


    // load conversations
    useEffect(() => {

        const loadConversations = async () => {

            if (!currentUser || !token) {
                return;
            }


            try {

                const response = await api.get(
                    "/conversations",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );


                setConversations(
                    response.data.conversations
                );

            } catch (error) {

                setError(
                    error.response?.data?.message ||
                    "Failed to load conversations"
                );

            } finally {

                setConversationsLoading(false);
            }
        };


        loadConversations();

    }, [
        currentUser,
        token,
    ]);


    // search users
    useEffect(() => {

        const searchUsers = async () => {

            const search =
                searchText.trim();


            if (!search) {

                setSearchResults([]);

                setSearching(false);

                return;
            }


            if (!token) {
                return;
            }


            setSearching(true);


            try {

                const response = await api.get(
                    "/users/search",
                    {
                        params: {
                            search,
                        },

                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );


                setSearchResults(
                    response.data.users
                );

            } catch (error) {

                setSearchResults([]);

            } finally {

                setSearching(false);
            }
        };


        // delay search while user is typing
        const timeout = setTimeout(
            searchUsers,
            300
        );


        return () => {
            clearTimeout(timeout);
        };

    }, [
        searchText,
        token,
    ]);


    // open conversation
    const openConversation = async (
        conversation
    ) => {

        if (!token) {
            return;
        }


        // clear previous typing indicator
        setTypingUserId(null);


        setSelectedConversation(
            conversation
        );

        setMessages([]);

        setMessagesLoading(true);

        setError("");

        setSearchText("");

        setSearchResults([]);


        try {

            const response = await api.get(
                `/messages/conversation/${conversation.id}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );


            setMessages(
                response.data.messages
            );

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to load messages"
            );

        } finally {

            setMessagesLoading(false);
        }
    };


    // start direct conversation
    const startConversation = async (
        user
    ) => {

        if (!token) {
            return;
        }


        setError("");


        try {

            const response = await api.post(
                "/conversations/direct",
                {
                    userId: user.id,
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );


            const newConversation =
                response.data.conversation;


            setConversations(
                (previousConversations) => {

                    const exists =
                        previousConversations.some(
                            (conversation) =>
                                Number(
                                    conversation.id
                                ) ===
                                Number(
                                    newConversation.id
                                )
                        );


                    if (exists) {
                        return previousConversations;
                    }


                    return [
                        newConversation,
                        ...previousConversations,
                    ];
                }
            );


            // join the new conversation socket room
            socket.emit(
                "join_conversation",
                newConversation.id
            );


            await openConversation(
                newConversation
            );

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to start conversation"
            );
        }
    };


    // send message
    const sendMessage = async (event) => {

        event.preventDefault();


        if (
            !selectedConversation ||
            !messageText.trim() ||
            !token
        ) {
            return;
        }


        const content =
            messageText.trim();


        setMessageText("");

        setTypingUserId(null);

        setError("");


        try {

            await api.post(
                "/messages",
                {
                    conversationId:
                        selectedConversation.id,

                    content,
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

        } catch (error) {

            setMessageText(content);

            setError(
                error.response?.data?.message ||
                "Failed to send message"
            );
        }
    };


    // delete conversation
    const deleteConversation = async () => {

        if (
            !selectedConversation ||
            !token
        ) {
            return;
        }


        const confirmed = window.confirm(
            "Delete this conversation and all messages?"
        );


        if (!confirmed) {
            return;
        }


        try {

            await api.delete(
                `/conversations/${selectedConversation.id}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );


            setConversations(
                (previousConversations) =>
                    previousConversations.filter(
                        (conversation) =>
                            Number(
                                conversation.id
                            ) !==
                            Number(
                                selectedConversation.id
                            )
                    )
            );


            setSelectedConversation(null);

            setMessages([]);

            setTypingUserId(null);

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Failed to delete conversation"
            );
        }
    };


    if (
        authLoading ||
        conversationsLoading
    ) {

        return (
            <main className="min-h-screen flex items-center justify-center">

                <p>
                    Loading LinkUp...
                </p>

            </main>
        );
    }


    return (
        <main className="h-screen bg-gray-100 p-4">

            <div className="h-full max-w-7xl mx-auto bg-white border rounded-2xl overflow-hidden flex">


                <ChatSidebar
                    currentUser={currentUser}
                    conversations={conversations}
                    selectedConversation={
                        selectedConversation
                    }
                    searchText={searchText}
                    setSearchText={
                        setSearchText
                    }
                    searchResults={
                        searchResults
                    }
                    searching={searching}
                    onStartConversation={
                        startConversation
                    }
                    onOpenConversation={
                        openConversation
                    }
                    onLogout={logout}
                />


                <section className="flex-1 flex flex-col min-w-0">

                    {!selectedConversation ? (

                        <div className="flex-1 flex items-center justify-center">

                            <div className="text-center px-6">

                                <h2 className="text-2xl font-bold mb-2">
                                    Welcome to LinkUp
                                </h2>

                                <p className="text-gray-500">
                                    Select a conversation or search for someone.
                                </p>

                            </div>

                        </div>

                    ) : (

                        <>

                            <ChatHeader
                                conversation={
                                    selectedConversation
                                }
                                onDeleteConversation={
                                    deleteConversation
                                }
                            />


                            <MessageList
                                messages={messages}
                                currentUserId={
                                    currentUser?.id
                                }
                                loading={
                                    messagesLoading
                                }
                            />


                            {typingUserId && (

                                <div className="px-6 pb-2">

                                    <p className="text-sm text-gray-500 italic">
                                        {selectedConversation.user?.displayName} is typing...
                                    </p>

                                </div>

                            )}


                            {error && (

                                <p className="text-red-500 text-sm px-6 pb-2">
                                    {error}
                                </p>

                            )}


                            <MessageInput
                                messageText={
                                    messageText
                                }
                                setMessageText={
                                    setMessageText
                                }
                                onSendMessage={
                                    sendMessage
                                }
                                conversationId={
                                    selectedConversation.id
                                }
                            />

                        </>

                    )}

                </section>

            </div>

        </main>
    );
}