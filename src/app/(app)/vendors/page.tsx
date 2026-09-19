import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/format";
import {
  VENDOR_CATEGORY_LABELS,
  VENDOR_STATUS_COLORS,
  VENDOR_STATUS_LABELS,
} from "@/lib/labels";
import type { VendorStatus } from "@prisma/client";

export default async function VendorsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const statusFilter = params.status as VendorStatus | undefined;

  const vendors = await prisma.vendor.findMany({
    where: statusFilter ? { status: statusFilter } : undefined,
    orderBy: { createdAt: "desc" },
  });

  const allStatuses = Object.keys(VENDOR_STATUS_LABELS) as VendorStatus[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Vendor</h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola semua vendor pernikahanmu.
          </p>
        </div>
        <Link
          href="/vendors/new"
          className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-rose-700"
        >
          + Tambah Vendor
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/vendors"
          className={`rounded-full px-3 py-1.5 text-xs font-medium ${
            !statusFilter
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          Semua
        </Link>
        {allStatuses.map((status) => (
          <Link
            key={status}
            href={`/vendors?status=${status}`}
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${
              statusFilter === status
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {VENDOR_STATUS_LABELS[status]}
          </Link>
        ))}
      </div>

      {vendors.length === 0 ? (
        <Card>
          <p className="text-sm text-slate-400">
            Belum ada vendor yang cocok. Tambahkan vendor baru untuk mulai.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vendors.map((vendor) => (
            <Link key={vendor.id} href={`/vendors/${vendor.id}`}>
              <Card className="h-full hover:border-rose-300 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 truncate">
                      {vendor.name}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {VENDOR_CATEGORY_LABELS[vendor.category]}
                    </p>
                  </div>
                  <Badge color={VENDOR_STATUS_COLORS[vendor.status]}>
                    {VENDOR_STATUS_LABELS[vendor.status]}
                  </Badge>
                </div>
                {vendor.agreedPrice != null && (
                  <p className="mt-4 text-sm font-semibold text-slate-800">
                    {formatCurrency(vendor.agreedPrice)}
                  </p>
                )}
                {vendor.contactName && (
                  <p className="mt-1 text-xs text-slate-400">
                    {vendor.contactName}
                    {vendor.contactPhone ? ` · ${vendor.contactPhone}` : ""}
                  </p>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
