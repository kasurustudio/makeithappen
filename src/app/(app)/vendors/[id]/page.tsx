import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDate, formatDateInput } from "@/lib/format";
import {
  VENDOR_CATEGORY_LABELS,
  VENDOR_STATUS_COLORS,
  VENDOR_STATUS_LABELS,
} from "@/lib/labels";
import { addVendorPayment, deleteVendor, deleteVendorPayment } from "../actions";

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500";
const labelClass = "block text-sm font-medium text-slate-700 mb-1";

export default async function VendorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vendor = await prisma.vendor.findUnique({
    where: { id },
    include: { payments: { orderBy: { paidAt: "desc" } } },
  });

  if (!vendor) notFound();

  const totalPaid = vendor.payments.reduce((sum, p) => sum + p.amount, 0);
  const remaining = (vendor.agreedPrice ?? 0) - totalPaid;

  const boundAddPayment = addVendorPayment.bind(null, vendor.id);
  const boundDeleteVendor = deleteVendor.bind(null, vendor.id);

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href="/vendors"
            className="text-xs font-medium text-slate-400 hover:text-slate-600"
          >
            ← Kembali ke Vendor
          </Link>
          <h1 className="text-xl font-semibold text-slate-900 mt-1">
            {vendor.name}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {VENDOR_CATEGORY_LABELS[vendor.category]}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge color={VENDOR_STATUS_COLORS[vendor.status]}>
            {VENDOR_STATUS_LABELS[vendor.status]}
          </Badge>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href={`/vendors/${vendor.id}/edit`}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Edit Vendor
        </Link>
        <form action={boundDeleteVendor}>
          <button
            type="submit"
            className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Hapus Vendor
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <p className="text-sm text-slate-500">Harga Disepakati</p>
          <p className="mt-1.5 text-lg font-semibold text-slate-900">
            {vendor.agreedPrice != null
              ? formatCurrency(vendor.agreedPrice)
              : "-"}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Sudah Dibayar</p>
          <p className="mt-1.5 text-lg font-semibold text-slate-900">
            {formatCurrency(totalPaid)}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Sisa Pembayaran</p>
          <p className="mt-1.5 text-lg font-semibold text-slate-900">
            {vendor.agreedPrice != null ? formatCurrency(remaining) : "-"}
          </p>
        </Card>
      </div>

      <Card>
        <h2 className="text-sm font-semibold text-slate-900 mb-4">
          Informasi Kontak
        </h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-slate-400">Nama Kontak</dt>
            <dd className="text-slate-800 mt-0.5">
              {vendor.contactName ?? "-"}
            </dd>
          </div>
          <div>
            <dt className="text-slate-400">Telepon / WA</dt>
            <dd className="text-slate-800 mt-0.5">
              {vendor.contactPhone ?? "-"}
            </dd>
          </div>
          <div>
            <dt className="text-slate-400">Email</dt>
            <dd className="text-slate-800 mt-0.5">
              {vendor.contactEmail ?? "-"}
            </dd>
          </div>
          <div>
            <dt className="text-slate-400">Instagram</dt>
            <dd className="text-slate-800 mt-0.5">
              {vendor.instagram ?? "-"}
            </dd>
          </div>
        </dl>
        {vendor.notes && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <dt className="text-slate-400 text-sm">Catatan</dt>
            <dd className="text-slate-700 text-sm mt-1 whitespace-pre-wrap">
              {vendor.notes}
            </dd>
          </div>
        )}
      </Card>

      <Card>
        <h2 className="text-sm font-semibold text-slate-900 mb-4">
          Riwayat Pembayaran
        </h2>
        {vendor.payments.length === 0 ? (
          <p className="text-sm text-slate-400 mb-4">Belum ada pembayaran.</p>
        ) : (
          <ul className="divide-y divide-slate-100 mb-4">
            {vendor.payments.map((payment) => {
              const boundDeletePayment = deleteVendorPayment.bind(
                null,
                vendor.id,
                payment.id
              );
              return (
                <li
                  key={payment.id}
                  className="py-3 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {payment.label}
                    </p>
                    <p className="text-xs text-slate-400">
                      {formatDate(payment.paidAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-semibold text-slate-900">
                      {formatCurrency(payment.amount)}
                    </span>
                    <form action={boundDeletePayment}>
                      <button
                        type="submit"
                        className="text-xs text-red-500 hover:underline"
                      >
                        Hapus
                      </button>
                    </form>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <details className="group">
          <summary className="cursor-pointer text-sm font-medium text-rose-600 hover:underline list-none">
            + Catat Pembayaran Baru
          </summary>
          <form action={boundAddPayment} className="mt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass} htmlFor="label">
                  Label (mis. DP, Pelunasan)
                </label>
                <input
                  id="label"
                  name="label"
                  type="text"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="amount">
                  Nominal (Rp)
                </label>
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  min="0"
                  step="1000"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="paidAt">
                  Tanggal Bayar
                </label>
                <input
                  id="paidAt"
                  name="paidAt"
                  type="date"
                  defaultValue={formatDateInput(new Date())}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="notes">
                  Catatan
                </label>
                <input
                  id="notes"
                  name="notes"
                  type="text"
                  className={inputClass}
                />
              </div>
            </div>
            <button
              type="submit"
              className="rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-rose-700"
            >
              Simpan Pembayaran
            </button>
          </form>
        </details>
      </Card>
    </div>
  );
}
