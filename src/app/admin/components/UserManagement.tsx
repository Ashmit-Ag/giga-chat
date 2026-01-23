"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  totalGiftAmount: number;
  plan?: { name: string };
  selected?: boolean;
};

export default function UsersManager() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters (frontend only)
  const [planFilter, setPlanFilter] = useState("");
  const [minGift, setMinGift] = useState("");
  const [maxGift, setMaxGift] = useState("");

  const selectedUsers = users.filter(u => u.selected);

  const fetchUsers = async (reset = false) => {
    setLoading(true);
    const res = await fetch(`/api/admin/users?page=${reset ? 1 : page}`);
    const data = await res.json();

    setUsers(prev =>
      reset ? data : [...prev, ...data]
    );

    setLoading(false);
  };

  useEffect(() => {
    fetchUsers(true);
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      if (planFilter && (u.plan?.name ?? "Free") !== planFilter) return false;
      if (minGift && u.totalGiftAmount < Number(minGift)) return false;
      if (maxGift && u.totalGiftAmount > Number(maxGift)) return false;
      return true;
    });
  }, [users, planFilter, minGift, maxGift]);

  const deleteSelected = async () => {
    await fetch("/api/admin/users/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selectedUsers.map(u => u.id) }),
    });

    setUsers(users.filter(u => !u.selected));
  };

  return (
    <div className="flex flex-col gap-5 h-full pr-2">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">User Management</h2>

        <Button
          variant="destructive"
          disabled={!selectedUsers.length}
          onClick={deleteSelected}
        >
          Delete ({selectedUsers.length})
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <select
          value={planFilter}
          onChange={e => setPlanFilter(e.target.value)}
          className="bg-[#0f1424] border border-white/10 px-3 py-2 rounded text-sm"
        >
          <option value="">All Plans</option>
          <option value="Free">Free</option>
          <option value="Basic">Basic</option>
          <option value="Premium">Premium</option>
        </select>

        <input
          type="number"
          placeholder="Min Gift"
          value={minGift}
          onChange={e => setMinGift(e.target.value)}
          className="bg-[#0f1424] border border-white/10 px-3 py-2 rounded text-sm"
        />

        <input
          type="number"
          placeholder="Max Gift"
          value={maxGift}
          onChange={e => setMaxGift(e.target.value)}
          className="bg-[#0f1424] border border-white/10 px-3 py-2 rounded text-sm"
        />
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto scrollbar-indigo rounded-lg border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-[#0b0f1a] text-white/50">
            <tr>
              <th className="p-4 w-10" />
              <th className="p-4 text-left">Full Name</th>
              <th className="p-4 text-left">Plan</th>
              <th className="p-4 text-right">Total Gift</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, idx) => (
              <tr
                key={user.id}
                className={`${
                  idx % 2 === 0 ? "bg-[#0f1424]" : "bg-[#0b0f1a]"
                } hover:bg-indigo-500/10 transition`}
              >
                <td className="p-4">
                  <button
                    onClick={() =>
                      setUsers(users.map(u =>
                        u.id === user.id
                          ? { ...u, selected: !u.selected }
                          : u
                      ))
                    }
                    className={`w-5 h-5 rounded border flex items-center justify-center ${
                      user.selected
                        ? "bg-indigo-600 border-indigo-600"
                        : "border-white/20"
                    }`}
                  >
                    {user.selected && (
                      <Check size={14} className="text-white" />
                    )}
                  </button>
                </td>
                <td className="p-4 font-medium">
                  {user.firstName} {user.lastName}
                </td>
                <td className="p-4">{user.plan?.name ?? "Free"}</td>
                <td className="p-4 text-right text-indigo-400 font-semibold">
                  ₹{user.totalGiftAmount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center">
        <Button
          onClick={() => {
            setPage(p => p + 1);
            fetchUsers();
          }}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-500"
        >
          Load More
        </Button>
      </div>
    </div>
  );
}
