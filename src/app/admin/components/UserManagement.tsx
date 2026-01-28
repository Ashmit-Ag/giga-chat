"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";


type User = {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    age: number;
    city: string;
    gender: string;
    pfpUrl: string;
    selected?: boolean;
    totalGiftAmount: number;
    totalImageAmount: number;
    createdAt: Date,
    phone: number;
    plan: { name: string };
};


export default function UsersManager() {
    const [users, setUsers] = useState<User[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [planFilter, setPlanFilter] = useState<"ALL" | "FREE" | "BASIC" | "PREMIUM">("ALL");

    const [sortBy, setSortBy] = useState<"GIFTS" | "IMAGES" | null>("GIFTS");
    const [sortDir, setSortDir] = useState<"ASC" | "DESC">("DESC");

    // Reset password dialog
    const [resetOpen, setResetOpen] = useState(false);
    const [resetUser, setResetUser] = useState<User | null>(null);
    const [newPassword, setNewPassword] = useState("");


    const fetchUsers = async (reset = false) => {
        setLoading(true);
        const res = await fetch(`/api/admin/users?page=${reset ? 1 : page}`);
        const data = await res.json();

        setUsers(prev => (reset ? data : [...prev, ...data]));
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers(true);
    }, []);

    const visibleUsers = users
        .filter(u =>
            u.username.toLowerCase().includes(search.toLowerCase())
        )
        .filter(u =>
            planFilter === "ALL" || u.plan.name.toUpperCase() === planFilter
        )
        .sort((a, b) => {
            if (!sortBy) return 0;

            const aVal =
                sortBy === "GIFTS" ? a.totalGiftAmount : a.totalImageAmount;
            const bVal =
                sortBy === "GIFTS" ? b.totalGiftAmount : b.totalImageAmount;

            return sortDir === "DESC" ? bVal - aVal : aVal - bVal;
        });


    const formatDate = (date: Date | string) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();

        return `${day}/${month}/${year}`;
    };



    return (
        <div className="flex flex-col gap-5 h-full pr-2">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">User Management</h2>

                <div className="flex gap-2">
                </div>
            </div>

            <div className="flex gap-3">
                <input
                    placeholder="Search username..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="rounded-lg border border-white/10 bg-black/30 px-4 py-2 text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />

                <Select
                    value={planFilter}
                    onValueChange={(value) =>
                        setPlanFilter(value as "ALL" | "FREE" | "BASIC" | "PREMIUM")
                    }
                >
                    <SelectTrigger className="w-40 rounded-lg border border-white/10 bg-black/30 text-white focus:ring-1 focus:ring-indigo-500">
                        <SelectValue placeholder="All Plans" />
                    </SelectTrigger>

                    <SelectContent className="bg-[#0b0f1a] border border-white/10 text-white">
                        <SelectItem value="ALL">All Plans</SelectItem>
                        <SelectItem value="FREE">Free</SelectItem>
                        <SelectItem value="BASIC">Basic</SelectItem>
                        <SelectItem value="PREMIUM">Premium</SelectItem>
                    </SelectContent>
                </Select>

            </div>



            {/* Table */}
            <div className="flex-1 overflow-y-auto rounded-lg border border-white/10 scrollbar-indigo">
                <table className="w-full text-sm">
                    <thead className="bg-[#0b0f1a] text-white/50">
                        <tr>
                            {/* <th className="p-4 w-10" /> */}
                            <th className="p-4 text-left">Sign Up Datet</th>
                            <th className="p-4 text-left">Full Name</th>
                            <th className="p-4 text-left">Username</th>
                            <th className="p-4 text-left">Phone</th>
                            <th className="p-4 text-center">Age</th>
                            {/* <th className="p-4 text-center">Gifts Purchased</th> */}
                            <th
                                className="p-4 text-center cursor-pointer select-none"
                                onClick={() => {
                                    setSortBy("GIFTS");
                                    setSortDir(d => (sortBy === "GIFTS" && d === "DESC" ? "ASC" : "DESC"));
                                }}
                            >
                                Gifts Purchased {sortBy === "GIFTS" && (sortDir === "DESC" ? "↓" : "↑")}
                            </th>

                            {/* <th className="p-4 text-center">Imagess Purchased</th> */}
                            <th
                                className="p-4 text-center cursor-pointer select-none"
                                onClick={() => {
                                    setSortBy("IMAGES");
                                    setSortDir(d => (sortBy === "IMAGES" && d === "DESC" ? "ASC" : "DESC"));
                                }}
                            >
                                Images Purchased {sortBy === "IMAGES" && (sortDir === "DESC" ? "↓" : "↑")}
                            </th>
                            <th className="p-4 text-center">Plan</th>
                            <th className="p-4 text-center">Actions</th>

                        </tr>
                    </thead>
                    <tbody>
                        {visibleUsers.map((user, idx) => (
                            <tr
                                key={user.id}
                                className={`${idx % 2 === 0 ? "bg-[#0f1424]" : "bg-[#0b0f1a]"}`}
                            >

                                <td className="p-4 font-medium">{formatDate(user.createdAt)}</td>
                                <td className="p-4 font-medium">{user.firstName} {user.lastName}</td>
                                <td className="p-4 text-indigo-400">{user.username}</td>
                                <td className="p-4 text-indigo-400">{user.phone}</td>
                                <td className="p-4 text-center">{user.age}</td>
                                <td className="p-4 text-center">{user.totalGiftAmount}</td>
                                <td className="p-4 text-center">{user.totalImageAmount}</td>
                                {/* <td className="p-4 text-center">{user.plan.name}</td> */}
                                <td className="p-4 text-center">
                                    <span
                                        className={`font-medium ${user.plan.name.toUpperCase() === "PREMIUM"
                                                ? "text-amber-400"
                                                : user.plan.name.toUpperCase() === "BASIC"
                                                    ? "text-cyan-500"
                                                    : "text-gray-400"
                                            }`}
                                    >
                                        {user.plan.name}
                                    </span>
                                </td>

                                <td className="p-4 text-center">
                                    <Button
                                        size="sm"
                                        // variant="outline"
                                        className="text-indigo-600 bg-transparent hover:bg-indigo-800 hover:text-white"
                                        onClick={() => {
                                            setResetUser(user);
                                            setResetOpen(true);
                                        }}
                                    >
                                        Reset Password
                                    </Button>
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
                        setPage(p => {
                            const next = p + 1;
                            fetch(`/api/admin/users?page=${next}`)
                                .then(res => res.json())
                                .then(data => setUsers(prev => [...prev, ...data]));
                            return next;
                        });

                    }}
                    disabled={loading}
                    className="bg-indigo-600"
                >
                    Load More
                </Button>
            </div>
            {resetUser && (
                <Dialog open={resetOpen} onOpenChange={setResetOpen}>
                    <DialogContent className="max-w-md bg-[#0b0f1a] border border-white/10">
                        <DialogHeader>
                            <DialogTitle className="text-white">Reset Password</DialogTitle>
                        </DialogHeader>

                        <p className="text-sm text-gray-400 mb-4">
                            Reset password for{" "}
                            <span className="font-semibold text-white">
                                {resetUser.firstName} {resetUser.lastName}
                            </span>{" "}
                            (@{resetUser.username})
                        </p>

                        <div className="mb-6">
                            <label className="mb-1 block text-sm text-gray-300">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-2 text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>

                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setResetOpen(false);
                                    setNewPassword("");
                                }}
                            >
                                Cancel
                            </Button>

                            <Button
                                className="bg-indigo-600"
                                onClick={async () => {
                                    await fetch("/api/admin/users", {
                                        method: "PATCH",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({
                                            userId: resetUser.id,
                                            password: newPassword,
                                        }),
                                    });

                                    setResetOpen(false);
                                    setNewPassword("");
                                }}
                            >
                                Reset Password
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

        </div>
    );
}
