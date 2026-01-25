import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { UserDetails } from "@/hooks/useModChatSocket";

export default function FriendsSidebar() {
    const [friends, setFriends] = useState<UserDetails[]>([]);
    const [search, setSearch] = useState("");

    //   useEffect(() => {
    //     const fetchFriends = async () => {
    //       try {
    //         const res = await fetch("/api/friends");
    //         const data = await res.json();
    //         setFriends(data);
    //       } catch (err) {
    //         console.error("Failed to fetch friends", err);
    //       }
    //     };

    //     fetchFriends();
    //   }, []);

    const filteredFriends = friends.filter(friend =>
        friend.firstName.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <aside className="flex w-72 h-[100dvh] bg-[#0e1326] border-l border-white/10 p-3 z-40  flex-col ">
            {/* Header */}
            <h2 className="text-sm font-semibold text-white mb-3">
                Friends
            </h2>

            {/* Search */}
            <div className="flex items-center gap-2 bg-black/30 rounded-lg px-2 py-1.5 mb-3">
                <Search className="w-4 h-4 text-white/40" />
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search friends..."
                    className="bg-transparent outline-none text-sm text-white w-full placeholder:text-white/40"
                />
            </div>

            {/* Friends List */}
            <div className="flex-1 overflow-y-auto space-y-1">
                {filteredFriends.length === 0 ? (
                    <div className="text-white/40 text-sm text-center py-6">
                        No friends found
                    </div>
                ) : (
                    filteredFriends.map((friend, id) => (
                        <button
                            key={id}
                            className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5 transition text-left group"
                        >
                            {/* Profile Picture Container */}
                            <div className="relative w-8 h-8 flex-shrink-0">
                                {friend.avatarUrl ? (
                                    <img
                                        src={friend.avatarUrl}
                                        alt={friend.firstName}
                                        className="w-full h-full rounded-full object-cover border border-white/10"
                                        onError={(e) => {
                                            // Fallback if image fails to load
                                            e.currentTarget.style.display = 'none';
                                            e.currentTarget.parentElement?.querySelector('.fallback')?.classList.remove('hidden');
                                        }}
                                    />
                                ) : null}

                                {/* Fallback Initial (Visible if no URL or image fails) */}
                                <div className={`fallback ${friend.avatarUrl ? 'hidden' : ''} w-full h-full rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-semibold`}>
                                    {friend.firstName.charAt(0)}
                                </div>
                            </div>

                            <div className="flex flex-col min-w-0">
                                <span className="text-sm text-white truncate font-medium">
                                    {friend.firstName} {friend.lastName}
                                </span>
                                {/* Optional: Add a small detail like city or plan */}
                                <span className="text-[10px] text-white/40 truncate">
                                    {friend.city || 'Available'}
                                </span>
                            </div>
                        </button>
                    ))
                )}
            </div>
        </aside>
    );
}
