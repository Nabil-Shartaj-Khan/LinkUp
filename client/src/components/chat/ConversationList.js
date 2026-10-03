import ConversationItem from "./ConversationItem";


export default function ConversationList({
    conversations,
    selectedConversation,
    onOpenConversation,
}) {

    // show empty conversation state
    if (conversations.length === 0) {
        return (
            <div className="flex-1 overflow-y-auto">

                <p className="text-gray-500 text-center mt-10 px-4">
                    Search for someone to start chatting.
                </p>

            </div>
        );
    }


    return (
        <div className="flex-1 overflow-y-auto">

            {conversations.map((conversation) => (

                <ConversationItem
                    key={conversation.id}
                    conversation={conversation}
                    isSelected={
                        Number(
                            selectedConversation?.id
                        ) ===
                        Number(
                            conversation.id
                        )
                    }
                    onOpen={onOpenConversation}
                />

            ))}

        </div>
    );
}