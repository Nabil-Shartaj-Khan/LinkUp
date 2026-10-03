export default function MessageBubble({
    message,
    currentUserId,
}) {

    // check if the message belongs to the logged-in user
    const isMine =
        Number(message.sender.id) ===
        Number(currentUserId);


    return (
        <div
            className={`flex ${
                isMine
                    ? "justify-end"
                    : "justify-start"
            }`}
        >

            <div
                className={`max-w-md rounded-2xl px-4 py-3 ${
                    isMine
                        ? "bg-black text-white"
                        : "bg-gray-100 text-black"
                }`}
            >

                <p>
                    {message.content}
                </p>


                <p
                    className={`text-xs mt-1 ${
                        isMine
                            ? "text-gray-300"
                            : "text-gray-500"
                    }`}
                >
                    {new Date(
                        message.createdAt
                    ).toLocaleTimeString(
                        [],
                        {
                            hour: "2-digit",
                            minute: "2-digit",
                        }
                    )}
                </p>

            </div>

        </div>
    );
}