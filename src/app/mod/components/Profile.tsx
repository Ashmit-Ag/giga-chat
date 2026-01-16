'use client'

import { useEffect, useRef, useState } from 'react'
import { Search } from 'lucide-react'

interface Friend {
  id: string
  name: string
}

export default function ChatHeader({
  connected,
  partner
}: {
  connected: boolean
  partner?: { name: string }
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const menuRef = useRef<HTMLDivElement>(null)

  /* --------------------------------
     Fake friends (replace later)
  -------------------------------- */
  const [friends, setFriends] = useState<Friend[]>([
    { id: '1', name: 'Arjun' },
    { id: '2', name: 'Rohit' },
    { id: '3', name: 'Ananya' },
    { id: '4', name: 'Karan' },
    { id: '5', name: 'Ishita' }
  ])

  // API placeholder
  /*
  useEffect(() => {
    const fetchFriends = async () => {
      const res = await fetch('/api/friends')
      const data = await res.json()
      setFriends(data)
    }
    fetchFriends()
  }, [])
  */

  /* --------------------------------
     Close menu on outside click
  -------------------------------- */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filteredFriends = friends.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase())
  )

  const displayName = connected ? partner?.name ?? 'User' : 'ME'
  const initial = displayName.charAt(0).toUpperCase()

  return (
    <div className="relative flex items-center gap-3">

      {/* PROFILE */}
      <button
        onClick={() => !connected && setOpen(prev => !prev)}
        className="flex items-center gap-3"
      >
        {/* Fake Avatar */}
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold text-sm select-none">
          {initial}
        </div>

        <h1 className="font-semibold text-white text-sm">
          {displayName}
        </h1>
      </button>

      {/* FRIENDS MENU */}
      {!connected && open && (
        <div
          ref={menuRef}
          className="absolute top-10 left-0 w-64 bg-[#0e1326] border border-white/10 rounded-xl shadow-xl z-50 p-3"
        >
          {/* SEARCH */}
          <div className="flex items-center gap-2 bg-black/30 rounded-lg px-2 py-1.5 mb-2">
            <Search className="w-4 h-4 text-white/40" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search friends..."
              className="bg-transparent outline-none text-sm text-white w-full placeholder:text-white/40"
            />
          </div>

          {/* FRIEND LIST */}
          <div className="max-h-48 overflow-y-auto space-y-1">
            {filteredFriends.length === 0 ? (
              <div className="text-white/40 text-sm text-center py-4">
                No friends found
              </div>
            ) : (
              filteredFriends.map(friend => (
                <button
                  key={friend.id}
                  className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5 transition"
                >
                  <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-semibold">
                    {friend.name.charAt(0)}
                  </div>
                  <span className="text-sm text-white">
                    {friend.name}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
