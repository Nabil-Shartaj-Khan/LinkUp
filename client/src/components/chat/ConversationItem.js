export default function ConversationItem({
    conversation,
    isSelected,
    onOpen,
}) {

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

                    <p className="font-semibold truncate">
                        {conversation.user?.displayName}
                    </p>

                    <p className="text-sm text-gray-500 truncate">

                        {conversation.lastMessage
                            ?.content ||
                            "Start a conversation"}

                    </p>

                </div>

            </div>

        </button>
    );
}