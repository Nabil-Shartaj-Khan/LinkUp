export default function MessageBubble({
    message,
    currentUserId,
}) {

    // check if the message belongs to the logged-in user
    const isMine =
        Number(message.sender.id) ===
        Number(currentUserId);


    // get message status indicator
    const getMessageStatus = () => {

        if (message.status === "read") {
            return "✓✓ Read";
        }


        if (message.status === "delivered") {
            return "✓✓ Delivered";
        }


        return "✓ Sent";
    };


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


                <div
                    className={`flex items-center gap-2 mt-1 ${
                        isMine
                            ? "justify-end text-gray-300"
                            : "justify-start text-gray-500"
                    }`}
                >

                    <p className="text-xs">
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


                    {isMine && (

                        <p className="text-xs">
                            {getMessageStatus()}
                        </p>

                    )}

                </div>

            </div>

        </div>
    );
}