import { Card } from "@/components/ui/Card";
import { GuestForm } from "../GuestForm";
import { createGuest } from "../actions";

export default function NewGuestPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Tambah Tamu</h1>
        <p className="text-sm text-slate-500 mt-1">
          Tambahkan tamu baru ke daftar undangan.
        </p>
      </div>
      <Card>
        <GuestForm action={createGuest} submitLabel="Simpan Tamu" />
      </Card>
    </div>
  );
}
