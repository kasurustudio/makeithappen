import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { formatCurrency, formatDate } from "@/lib/format";
import { StatCard } from "@/components/StatCard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  TASK_PRIORITY_COLORS,
  TASK_PRIORITY_LABELS,
  VENDOR_STATUS_COLORS,
  VENDOR_STATUS_LABELS,
} from "@/lib/labels";

export default async function DashboardPage() {
  const [settings, vendors, payments, guests, upcomingTasks] =
    await Promise.all([
      getSettings(),
      prisma.vendor.findMany(),
      prisma.payment.aggregate({ _sum: { amount: true } }),
      prisma.guest.findMany(),
      prisma.checklistTask.findMany({
        where: { status: { not: "DONE" } },
        orderBy: [{ dueDate: "asc" }, { priority: "desc" }],
        take: 5,
      }),
    ]);

  const totalSpent = payments._sum.amount ?? 0;
  const totalBudget = settings.totalBudget;
  const remaining = totalBudget - totalSpent;

  const vendorsByStatus = vendors.reduce<Record<string, number>>(
    (acc, v) => {
      acc[v.status] = (acc[v.status] ?? 0) + 1;
      return acc;
    },
    {}
  );

  const totalPaxAttending = guests
    .filter((g) => g.rsvpStatus === "ATTENDING")
    .reduce((sum, g) => sum + g.pax, 0);
  const totalGuests = guests.length;
  const pendingRsvp = guests.filter((g) => g.rsvpStatus === "PENDING").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">
          Ringkasan persiapan pernikahanmu.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Budget"
          value={formatCurrency(totalBudget)}
          helper={
            totalBudget > 0
              ? `${Math.round((totalSpent / totalBudget) * 100)}% terpakai`
              : "Belum diatur"
          }
        />
        <StatCard label="Sudah Dibayar" value={formatCurrency(totalSpent)} />
        <StatCard
          label="Sisa Budget"
          value={formatCurrency(remaining)}
          helper={remaining < 0 ? "Melebihi budget!" : undefined}
        />
        <StatCard
          label="Vendor Terbooking"
          value={`${(vendorsByStatus.BOOKED ?? 0) + (vendorsByStatus.PAID_IN_FULL ?? 0)} / ${vendors.length}`}
          helper="dari total vendor"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <StatCard
          label="Tamu Diundang"
          value={`${totalGuests}`}
          helper={`${totalPaxAttending} pax konfirmasi hadir`}
        />
        <StatCard
          label="Belum Konfirmasi RSVP"
          value={`${pendingRsvp}`}
          helper="tamu"
        />
        <StatCard
          label="Vendor Booked"
          value={`${vendorsByStatus.BOOKED ?? 0}`}
          helper={`${vendorsByStatus.NEGOTIATING ?? 0} sedang negosiasi`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Tugas Mendatang
            </h2>
            <Link
              href="/checklist"
              className="text-xs font-medium text-rose-600 hover:underline"
            >
              Lihat semua
            </Link>
          </div>
          {upcomingTasks.length === 0 ? (
            <p className="text-sm text-slate-400">
              Tidak ada tugas mendatang. Tambahkan checklist baru.
            </p>
          ) : (
            <ul className="space-y-3">
              {upcomingTasks.map((task) => (
                <li
                  key={task.id}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {task.title}
                    </p>
                    <p className="text-xs text-slate-400">
                      {task.dueDate ? formatDate(task.dueDate) : "Tanpa tenggat"}
                    </p>
                  </div>
                  <Badge color={TASK_PRIORITY_COLORS[task.priority]}>
                    {TASK_PRIORITY_LABELS[task.priority]}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Status Vendor
            </h2>
            <Link
              href="/vendors"
              className="text-xs font-medium text-rose-600 hover:underline"
            >
              Lihat semua
            </Link>
          </div>
          {vendors.length === 0 ? (
            <p className="text-sm text-slate-400">
              Belum ada vendor. Tambahkan vendor pertamamu.
            </p>
          ) : (
            <ul className="space-y-3">
              {vendors.slice(0, 5).map((vendor) => (
                <li
                  key={vendor.id}
                  className="flex items-center justify-between gap-3"
                >
                  <p className="text-sm font-medium text-slate-800 truncate">
                    {vendor.name}
                  </p>
                  <Badge color={VENDOR_STATUS_COLORS[vendor.status]}>
                    {VENDOR_STATUS_LABELS[vendor.status]}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
