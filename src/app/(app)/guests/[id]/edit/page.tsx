import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { GuestForm } from "../../GuestForm";
import { updateGuest } from "../../actions";

export default async function EditGuestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const guest = await prisma.guest.findUnique({ where: { id } });
  if (!guest) notFound();

  const boundUpdate = updateGuest.bind(null, id);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Edit Tamu</h1>
        <p className="text-sm text-slate-500 mt-1">{guest.name}</p>
      </div>
      <Card>
        <GuestForm
          guest={guest}
          action={boundUpdate}
          submitLabel="Simpan Perubahan"
        />
      </Card>
    </div>
  );
}
