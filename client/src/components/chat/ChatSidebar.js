import UserSearch from "./UserSearch";
import ConversationList from "./ConversationList";


export default function ChatSidebar({
    currentUser,
    conversations,
    selectedConversation,
    searchText,
    setSearchText,
    searchResults,
    searching,
    onStartConversation,
    onOpenConversation,
    onLogout,
}) {

    return (
        <aside className="w-80 border-r flex flex-col">

            {/* sidebar header */}
            <div className="p-5 border-b">

                <div className="flex items-center justify-between">

                    <div>

                        <h1 className="text-2xl font-bold">
                            LinkUp
                        </h1>

                        <p className="text-sm text-gray-500">
                            {currentUser?.displayName}
                        </p>

                    </div>


                    <button
                        onClick={onLogout}
                        className="text-sm border rounded-lg px-3 py-2 hover:bg-gray-50"
                    >
                        Logout
                    </button>

                </div>

            </div>


            {/* user search */}
            <UserSearch
                searchText={searchText}
                setSearchText={setSearchText}
                searchResults={searchResults}
                searching={searching}
                onStartConversation={
                    onStartConversation
                }
            />


            {/* conversation list */}
            <ConversationList
                conversations={conversations}
                selectedConversation={
                    selectedConversation
                }
                onOpenConversation={
                    onOpenConversation
                }
            />

        </aside>
    );
}