"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  totalGiftAmount: number;
};

type Mod = {
  id: string;
  email: string;
  totalGiftAmount: number
}

export default function TopGiftersCard() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/admin/users/gifts");
        const data = await res.json();

        if (data.success) {
          setUsers(data.users);
        }
      } catch (err) {
        console.error("Failed to load top gifters", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((u) =>
      u.username.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  return (
    <Card className="bg-[#0f1424] border-white/10">
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex justify-between items-center">
          <p className="text-xs text-white/80 font-bold uppercase">
            Top Gifters
          </p>
          <span className="text-[10px] text-white/40">
            {filteredUsers.length} users
          </span>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#0b1020] border border-white/10 rounded-md px-3 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />

        {/* List */}
        <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
          {loading ? (
            <p className="text-xs text-white/40 text-center py-6">
              Loading...
            </p>
          ) : filteredUsers.length === 0 ? (
            <p className="text-xs text-white/30 text-center py-6">
              No users found
            </p>
          ) : (
            filteredUsers.map((user, index) => (
              <div
                key={user.id}
                className="flex justify-between items-center px-3 py-2 rounded-md bg-white/5 hover:bg-white/10 transition"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-white/40 w-5">
                    {index + 1}
                  </span>
                  <span className="text-sm text-white font-medium truncate">
                    {user.firstName} {user.lastName}
                  </span>
                </div>

                <span className="text-sm font-semibold text-indigo-400">
                  Rs.{user.totalGiftAmount.toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
