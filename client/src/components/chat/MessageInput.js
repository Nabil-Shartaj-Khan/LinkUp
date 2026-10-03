import { useEffect, useRef } from "react";

import socket from "@/lib/socket";


export default function MessageInput({
    messageText,
    setMessageText,
    onSendMessage,
    conversationId,
}) {

    const typingTimeoutRef =
        useRef(null);


    // handle message input
    const handleChange = (event) => {

        const value =
            event.target.value;


        setMessageText(value);


        // notify other users that typing started
        if (value.trim()) {

            socket.emit(
                "typing_start",
                conversationId
            );

        } else {

            socket.emit(
                "typing_stop",
                conversationId
            );
        }


        // reset previous typing timeout
        if (typingTimeoutRef.current) {

            clearTimeout(
                typingTimeoutRef.current
            );
        }


        // automatically stop typing after inactivity
        typingTimeoutRef.current =
            setTimeout(() => {

                socket.emit(
                    "typing_stop",
                    conversationId
                );

            }, 1500);
    };


    // handle message submission
    const handleSubmit = (event) => {

        socket.emit(
            "typing_stop",
            conversationId
        );


        if (typingTimeoutRef.current) {

            clearTimeout(
                typingTimeoutRef.current
            );
        }


        onSendMessage(event);
    };


    // stop typing when component closes
    useEffect(() => {

        return () => {

            if (typingTimeoutRef.current) {

                clearTimeout(
                    typingTimeoutRef.current
                );
            }


            socket.emit(
                "typing_stop",
                conversationId
            );
        };

    }, [conversationId]);


    return (
        <form
            onSubmit={handleSubmit}
            className="border-t p-4 flex gap-3"
        >

            <input
                type="text"
                value={messageText}
                onChange={handleChange}
                placeholder="Type a message..."
                className="flex-1 bg-gray-100 rounded-xl px-4 py-3 outline-none"
            />


            <button
                type="submit"
                disabled={!messageText.trim()}
                className="bg-black text-white px-6 rounded-xl font-medium disabled:opacity-40 disabled:cursor-not-allowed"
            >
                Send
            </button>

        </form>
    );
}