import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/StatCard";
import { formatCurrency, formatDate, formatDateInput } from "@/lib/format";
import {
  addPayment,
  createBudgetCategory,
  deleteBudgetCategory,
  deletePayment,
  updateSettings,
} from "./actions";

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500";
const labelClass = "block text-sm font-medium text-slate-700 mb-1";

export default async function BudgetPage() {
  const [settings, categories, payments, vendors] = await Promise.all([
    getSettings(),
    prisma.budgetCategory.findMany({
      include: { payments: true, vendors: true },
      orderBy: { name: "asc" },
    }),
    prisma.payment.findMany({
      include: { vendor: true, budgetCategory: true },
      orderBy: { paidAt: "desc" },
      take: 20,
    }),
    prisma.vendor.findMany({ orderBy: { name: "asc" } }),
  ]);

  const totalSpent = categories.reduce(
    (sum, c) => sum + c.payments.reduce((s, p) => s + p.amount, 0),
    0
  );
  const unallocatedSpent = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: { budgetCategoryId: null },
  });
  const totalSpentAll = totalSpent + (unallocatedSpent._sum.amount ?? 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Budget</h1>
        <p className="text-sm text-slate-500 mt-1">
          Pantau anggaran dan pengeluaran pernikahanmu.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Budget"
          value={formatCurrency(settings.totalBudget)}
        />
        <StatCard label="Total Terpakai" value={formatCurrency(totalSpentAll)} />
        <StatCard
          label="Sisa Budget"
          value={formatCurrency(settings.totalBudget - totalSpentAll)}
        />
      </div>

      <Card>
        <details>
          <summary className="cursor-pointer text-sm font-semibold text-slate-900 list-none">
            Pengaturan Acara & Total Budget
          </summary>
          <form action={updateSettings} className="mt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass} htmlFor="brideName">
                  Nama Mempelai Wanita
                </label>
                <input
                  id="brideName"
                  name="brideName"
                  type="text"
                  defaultValue={settings.brideName ?? ""}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="groomName">
                  Nama Mempelai Pria
                </label>
                <input
                  id="groomName"
                  name="groomName"
                  type="text"
                  defaultValue={settings.groomName ?? ""}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="weddingDate">
                  Tanggal Pernikahan
                </label>
                <input
                  id="weddingDate"
                  name="weddingDate"
                  type="date"
                  defaultValue={formatDateInput(settings.weddingDate)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="totalBudget">
                  Total Budget (Rp)
                </label>
                <input
                  id="totalBudget"
                  name="totalBudget"
                  type="number"
                  min="0"
                  step="100000"
                  defaultValue={settings.totalBudget}
                  className={inputClass}
                />
              </div>
            </div>
            <button
              type="submit"
              className="rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-rose-700"
            >
              Simpan Pengaturan
            </button>
          </form>
        </details>
      </Card>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-900">
            Kategori Budget
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {categories.map((cat) => {
            const spent = cat.payments.reduce((s, p) => s + p.amount, 0);
            const pct =
              cat.plannedAmount > 0
                ? Math.min(100, Math.round((spent / cat.plannedAmount) * 100))
                : 0;
            const over = cat.plannedAmount > 0 && spent > cat.plannedAmount;
            const boundDelete = deleteBudgetCategory.bind(null, cat.id);
            return (
              <Card key={cat.id}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-slate-900">{cat.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {formatCurrency(spent)} / {formatCurrency(cat.plannedAmount)}
                    </p>
                  </div>
                  <form action={boundDelete}>
                    <button
                      type="submit"
                      className="text-xs text-red-500 hover:underline"
                    >
                      Hapus
                    </button>
                  </form>
                </div>
                <div className="mt-3 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${over ? "bg-red-500" : "bg-rose-500"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                {over && (
                  <p className="mt-1.5 text-xs text-red-500">
                    Melebihi rencana anggaran
                  </p>
                )}
              </Card>
            );
          })}
        </div>

        <Card>
          <details>
            <summary className="cursor-pointer text-sm font-medium text-rose-600 hover:underline list-none">
              + Tambah Kategori Budget
            </summary>
            <form
              action={createBudgetCategory}
              className="mt-4 flex flex-col sm:flex-row gap-3"
            >
              <input
                name="name"
                type="text"
                placeholder="Nama kategori (mis. Venue, Katering)"
                required
                className={inputClass}
              />
              <input
                name="plannedAmount"
                type="number"
                min="0"
                step="100000"
                placeholder="Rencana anggaran (Rp)"
                className={inputClass}
              />
              <button
                type="submit"
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 whitespace-nowrap"
              >
                Tambah
              </button>
            </form>
          </details>
        </Card>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-slate-900 mb-4">
          Riwayat Pembayaran
        </h2>
        <Card>
          {payments.length === 0 ? (
            <p className="text-sm text-slate-400 mb-4">
              Belum ada pembayaran tercatat.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100 mb-4">
              {payments.map((payment) => {
                const boundDelete = deletePayment.bind(null, payment.id);
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
                        {payment.vendor ? ` · ${payment.vendor.name}` : ""}
                        {payment.budgetCategory
                          ? ` · ${payment.budgetCategory.name}`
                          : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm font-semibold text-slate-900">
                        {formatCurrency(payment.amount)}
                      </span>
                      <form action={boundDelete}>
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

          <details>
            <summary className="cursor-pointer text-sm font-medium text-rose-600 hover:underline list-none">
              + Catat Pembayaran Baru
            </summary>
            <form action={addPayment} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass} htmlFor="label">
                    Label
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
                  <label className={labelClass} htmlFor="budgetCategoryId">
                    Kategori Budget
                  </label>
                  <select
                    id="budgetCategoryId"
                    name="budgetCategoryId"
                    className={inputClass}
                  >
                    <option value="">Tanpa kategori</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass} htmlFor="vendorId">
                    Vendor
                  </label>
                  <select id="vendorId" name="vendorId" className={inputClass}>
                    <option value="">Tanpa vendor</option>
                    {vendors.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
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
    </div>
  );
}
