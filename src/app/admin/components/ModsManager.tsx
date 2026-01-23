'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import ModCard from "./ModCard";
import CreateModsModal from "./CreateModsModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

export type Mod = {
  id: string;
  email: string;
  password: string;
  selected?: boolean;
  modified?: boolean;
};

export default function ModsManager() {
  const [mods, setMods] = useState<Mod[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const selectedMods = mods.filter(m => m.selected);

  const fetchMods = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/mods");
    const data = await res.json();
    setMods(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMods();
  }, []);

  const saveChanges = async () => {
    const updates = mods.filter(m => m.modified);

    await fetch("/api/admin/mods/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ updates })
    });

    fetchMods();
  };

  const deleteSelected = async () => {
    await fetch("/api/admin/mods/update", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selectedMods.map(m => m.id) })
    });

    setShowDelete(false);
    fetchMods();
  };

  if (loading) return <div className="text-white/40">Loading mods...</div>;

  return (
    <div className="flex flex-col gap-6 h-full pr-2 min-h-0">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Moderator Management</h2>

        <div className="flex gap-2">
          <Button
            className="bg-indigo-600 hover:bg-indigo-500"
            onClick={() => setShowCreate(true)}>
            Create Mods
          </Button>
          <Button
            disabled={!mods.some(m => m.modified)}
            onClick={saveChanges}
            className="bg-indigo-600 hover:bg-indigo-500"
          >
            Save Changes
          </Button>
          <Button
            variant="destructive"
            disabled={!selectedMods.length}
            onClick={() => setShowDelete(true)}
          >
            Delete ({selectedMods.length})
          </Button>
        </div>
      </div>

      {/* Mod Cards */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-indigo">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pr-2 text-white/50">
          {mods.map(mod => (
            <ModCard
              key={mod.id}
              mod={mod}
              onChange={(changes: any) =>
                setMods(mods.map(m =>
                  m.id === mod.id ? { ...m, ...changes, modified: true } : m
                ))
              }
              onSelect={(checked: any) =>
                setMods(mods.map(m =>
                  m.id === mod.id ? { ...m, selected: checked } : m
                ))
              }
            />
          ))}
        </div>
      </div>


      {/* Modals */}
      {showCreate && (
        <CreateModsModal
          onClose={() => setShowCreate(false)}
          onCreated={fetchMods}
        />
      )}

      {showDelete && (
        <ConfirmDeleteModal
          count={selectedMods.length}
          onCancel={() => setShowDelete(false)}
          onConfirm={deleteSelected}
        />
      )}
    </div>
  );
}
