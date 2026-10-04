export default function ConversationItem({
    conversation,
    isSelected,
    onOpen,
    currentUserId,
}) {

    // check if this conversation has unread messages
    const hasUnread =
        Number(conversation.unreadCount || 0) > 0;


    // check if the last message was sent by the logged-in user
    const lastMessageIsMine =
        conversation.lastMessage &&
        Number(conversation.lastMessage.senderId) ===
        Number(currentUserId);


    // get last message preview
    const getLastMessagePreview = () => {

        if (!conversation.lastMessage) {
            return "Start a conversation";
        }


        const content =
            conversation.lastMessage.content ||
            "Attachment";


        if (lastMessageIsMine) {
            return `You: ${content}`;
        }


        return content;
    };


    return (
        <button
            onClick={() =>
                onOpen(conversation)
            }
            className={`w-full text-left p-4 border-b hover:bg-gray-50 ${
                isSelected
                    ? "bg-gray-100"
                    : ""
            }`}
        >

            <div className="flex gap-3">

                {/* user avatar */}
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-bold shrink-0">

                    {conversation.user
                        ?.displayName
                        ?.charAt(0)
                        ?.toUpperCase()}

                </div>


                {/* conversation information */}
                <div className="min-w-0 flex-1">

                    <div className="flex items-center justify-between gap-2">

                        <p
                            className={`truncate ${
                                hasUnread
                                    ? "font-bold text-black"
                                    : "font-semibold"
                            }`}
                        >
                            {conversation.user?.displayName}
                        </p>


                        {hasUnread && (

                            <span className="min-w-5 h-5 px-1.5 rounded-full bg-black text-white text-xs flex items-center justify-center shrink-0">
                                {conversation.unreadCount}
                            </span>

                        )}

                    </div>


                    <p
                        className={`text-sm truncate ${
                            hasUnread
                                ? "font-semibold text-black"
                                : "text-gray-500"
                        }`}
                    >
                        {getLastMessagePreview()}
                    </p>

                </div>

            </div>

        </button>
    );
}