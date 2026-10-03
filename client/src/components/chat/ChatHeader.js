export default function ChatHeader({
    conversation,
    onDeleteConversation,
}) {

    // format last seen time
    const formatLastSeen = (lastSeen) => {

        if (!lastSeen) {
            return "Offline";
        }


        const lastSeenDate =
            new Date(lastSeen);

        const now =
            new Date();

        const difference =
            now - lastSeenDate;

        const minutes =
            Math.floor(
                difference / 60000
            );


        if (minutes < 1) {
            return "Last seen just now";
        }


        if (minutes < 60) {
            return `Last seen ${minutes} ${
                minutes === 1
                    ? "minute"
                    : "minutes"
            } ago`;
        }


        const hours =
            Math.floor(
                minutes / 60
            );


        if (hours < 24) {
            return `Last seen ${hours} ${
                hours === 1
                    ? "hour"
                    : "hours"
            } ago`;
        }


        return `Last seen ${lastSeenDate.toLocaleDateString(
            [],
            {
                day: "numeric",
                month: "short",
            }
        )}`;
    };


    // convert mysql online value to boolean
    const isOnline =
        Boolean(conversation.user?.isOnline);


    return (
        <header className="h-20 border-b px-6 flex items-center justify-between shrink-0">

            <div className="flex items-center min-w-0">

                {/* user avatar */}
                <div className="relative mr-3 shrink-0">

                    <div className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center font-bold">

                        {conversation.user
                            ?.displayName
                            ?.charAt(0)
                            ?.toUpperCase()}

                    </div>


                    {/* online indicator */}
                    {isOnline && (

                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />

                    )}

                </div>


                {/* user information */}
                <div className="min-w-0">

                    <h2 className="font-semibold truncate">
                        {conversation.user?.displayName}
                    </h2>


                    <p
                        className={`text-sm truncate ${
                            isOnline
                                ? "text-green-600"
                                : "text-gray-500"
                        }`}
                    >

                        {isOnline
                            ? "Online"
                            : formatLastSeen(
                                conversation.user?.lastSeen
                            )
                        }

                    </p>

                </div>

            </div>


            {/* conversation actions */}
            <div className="flex items-center ml-4 shrink-0">

                <button
                    type="button"
                    onClick={onDeleteConversation}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700"
                >
                    Delete Conversation
                </button>

            </div>

        </header>
    );
}