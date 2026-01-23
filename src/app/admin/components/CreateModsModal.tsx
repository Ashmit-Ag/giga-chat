'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";

export default function CreateModsModal({ onClose }: any) {
  const [count, setCount] = useState(1);
  const [domain, setDomain] = useState("spark.chat.com");
  const [created, setCreated] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const createMods = async () => {
    setLoading(true);

    if(count > 50){
      notifications.show({
        title:"Limit Exceeded",
        message:"Max 50 mods can be created at a time",
        color: 'red',
        icon: <IconX size={16} />
      })
      return
    }

    const res = await fetch("/api/admin/mods/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ count, domain })
    });

    const data = await res.json();
    setCreated(data.mods);
    setLoading(false);
  };

  const copy = (email: string, password: string) => {
    navigator.clipboard.writeText(
      `Login Details\nEmail: ${email}\nPassword: ${password}`
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#0f1424] p-6 rounded-lg w-full max-w-lg space-y-4">
        <h3 className="text-lg font-semibold">Create Mods</h3>

        {!created.length ? (
          <>
            <input
              type="number"
              min={1}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full bg-transparent border border-white/10 rounded px-3 py-2"
              placeholder="Number of mods"
            />

            {/* <input
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full bg-transparent border border-white/10 rounded px-3 py-2"
              placeholder="Domain"
            /> */}

            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
              <Button onClick={createMods} disabled={loading}>
                {loading ? "Creating..." : "Create"}
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-xs text-yellow-400">
              ⚠️ Copy credentials now. Passwords will not be shown again.
            </p>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {created.map((mod) => (
                <div
                  key={mod.id}
                  className="flex justify-between items-center bg-[#0b0f1a] p-3 rounded border border-white/10"
                >
                  <div className="text-sm">
                    <p>{mod.email}</p>
                    <p className="text-white/40 text-xs">Password: {mod.password}</p>
                  </div>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => copy(mod.email, mod.password)}
                  >
                    <Copy size={14} />
                  </Button>
                </div>
              ))}
            </div>

            <Button className="w-full" onClick={onClose}>
              Done
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
