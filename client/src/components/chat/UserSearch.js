export default function UserSearch({
    searchText,
    setSearchText,
    searchResults,
    searching,
    onStartConversation,
}) {

    return (
        <div className="p-4 border-b">

            {/* search input */}
            <input
                type="text"
                value={searchText}
                onChange={(event) =>
                    setSearchText(
                        event.target.value
                    )
                }
                placeholder="Search users..."
                className="w-full bg-gray-100 rounded-lg px-4 py-3 outline-none"
            />


            {/* search results */}
            {searchText && (

                <div className="mt-3">

                    {searching ? (

                        <p className="text-sm text-gray-500 px-2">
                            Searching...
                        </p>

                    ) : searchResults.length === 0 ? (

                        <p className="text-sm text-gray-500 px-2">
                            No users found.
                        </p>

                    ) : (

                        <div className="space-y-1">

                            {searchResults.map((user) => (

                                <button
                                    key={user.id}
                                    onClick={() =>
                                        onStartConversation(
                                            user
                                        )
                                    }
                                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 text-left"
                                >

                                    {/* user avatar */}
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold shrink-0">

                                        {user.displayName
                                            ?.charAt(0)
                                            ?.toUpperCase()}

                                    </div>


                                    {/* user information */}
                                    <div className="min-w-0">

                                        <p className="font-medium truncate">
                                            {user.displayName}
                                        </p>

                                        <p className="text-xs text-gray-500 truncate">
                                            @{user.username}
                                        </p>

                                    </div>

                                </button>

                            ))}

                        </div>

                    )}

                </div>

            )}

        </div>
    );
}