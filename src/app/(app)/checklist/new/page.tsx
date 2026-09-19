import { Card } from "@/components/ui/Card";
import { ChecklistForm } from "../ChecklistForm";
import { createTask } from "../actions";

export default function NewTaskPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          Tambah Tugas
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Tambahkan tugas baru ke checklist persiapan.
        </p>
      </div>
      <Card>
        <ChecklistForm action={createTask} submitLabel="Simpan Tugas" />
      </Card>
    </div>
  );
}
