import MessageBubble from "./MessageBubble";


export default function MessageList({
    messages,
    currentUserId,
    loading,
}) {

    // show loading state
    if (loading) {
        return (
            <div className="flex-1 overflow-y-auto p-6">

                <p className="text-center text-gray-500">
                    Loading messages...
                </p>

            </div>
        );
    }


    // show empty conversation state
    if (messages.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center p-6">

                <p className="text-gray-500">
                    No messages yet. Say hello!
                </p>

            </div>
        );
    }


    return (
        <div className="flex-1 overflow-y-auto p-6">

            <div className="space-y-3">

                {messages.map((message) => (

                    <MessageBubble
                        key={message.id}
                        message={message}
                        currentUserId={currentUserId}
                    />

                ))}

            </div>

        </div>
    );
}