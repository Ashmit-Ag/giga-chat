import { Button } from "@/components/ui/button";

export default function ConfirmDeleteModal({ count, onConfirm, onCancel }: any) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#0f1424] p-6 rounded-lg w-full max-w-sm space-y-4">
        <h3 className="text-lg font-semibold text-red-400">Delete Mods</h3>
        <p className="text-sm text-white/60">
          Are you sure you want to delete {count} moderator account(s)?
        </p>

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
