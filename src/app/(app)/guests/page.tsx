import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/StatCard";
import { RSVP_STATUS_LABELS } from "@/lib/labels";
import { deleteGuest, quickUpdateRsvp } from "./actions";
import { RsvpSelect } from "./RsvpSelect";
import type { RsvpStatus } from "@prisma/client";

export default async function GuestsPage({
  searchParams,
}: {
  searchParams: Promise<{ rsvp?: string }>;
}) {
  const params = await searchParams;
  const rsvpFilter = params.rsvp as RsvpStatus | undefined;

  const guests = await prisma.guest.findMany({
    where: rsvpFilter ? { rsvpStatus: rsvpFilter } : undefined,
    orderBy: { createdAt: "desc" },
  });

  const allGuests = await prisma.guest.findMany();
  const totalPax = allGuests.reduce((s, g) => s + g.pax, 0);
  const attendingPax = allGuests
    .filter((g) => g.rsvpStatus === "ATTENDING")
    .reduce((s, g) => s + g.pax, 0);
  const pendingCount = allGuests.filter(
    (g) => g.rsvpStatus === "PENDING"
  ).length;

  const allStatuses = Object.keys(RSVP_STATUS_LABELS) as RsvpStatus[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            Tamu & RSVP
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola daftar tamu undangan.
          </p>
        </div>
        <Link
          href="/guests/new"
          className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-rose-700"
        >
          + Tambah Tamu
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Tamu Diundang" value={`${allGuests.length}`} helper={`${totalPax} pax`} />
        <StatCard label="Konfirmasi Hadir" value={`${attendingPax} pax`} />
        <StatCard label="Belum Konfirmasi" value={`${pendingCount}`} helper="tamu" />
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/guests"
          className={`rounded-full px-3 py-1.5 text-xs font-medium ${
            !rsvpFilter ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
          }`}
        >
          Semua
        </Link>
        {allStatuses.map((status) => (
          <Link
            key={status}
            href={`/guests?rsvp=${status}`}
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${
              rsvpFilter === status
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {RSVP_STATUS_LABELS[status]}
          </Link>
        ))}
      </div>

      {guests.length === 0 ? (
        <Card>
          <p className="text-sm text-slate-400">
            Belum ada tamu yang cocok. Tambahkan tamu baru untuk mulai.
          </p>
        </Card>
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs text-slate-400">
                <th className="px-4 py-3 font-medium">Nama</th>
                <th className="px-4 py-3 font-medium">Grup</th>
                <th className="px-4 py-3 font-medium">Pax</th>
                <th className="px-4 py-3 font-medium">Meja</th>
                <th className="px-4 py-3 font-medium">RSVP</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {guests.map((guest) => {
                const boundDelete = deleteGuest.bind(null, guest.id);
                const boundQuickUpdate = quickUpdateRsvp.bind(null, guest.id);
                return (
                  <tr
                    key={guest.id}
                    className="border-b border-slate-50 last:border-0"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800">
                        {guest.name}
                      </p>
                      {guest.phone && (
                        <p className="text-xs text-slate-400">
                          {guest.phone}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {guest.group ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{guest.pax}</td>
                    <td className="px-4 py-3 text-slate-500">
                      {guest.tableNumber ?? "-"}
                    </td>
                    <td className="px-4 py-3">
                      <RsvpSelect
                        defaultValue={guest.rsvpStatus}
                        action={boundQuickUpdate}
                      />
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <Link
                        href={`/guests/${guest.id}/edit`}
                        className="text-xs font-medium text-rose-600 hover:underline mr-3"
                      >
                        Edit
                      </Link>
                      <form action={boundDelete} className="inline">
                        <button
                          type="submit"
                          className="text-xs text-red-500 hover:underline"
                        >
                          Hapus
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
