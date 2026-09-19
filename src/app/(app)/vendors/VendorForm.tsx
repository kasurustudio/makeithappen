import { VENDOR_CATEGORY_LABELS, VENDOR_STATUS_LABELS } from "@/lib/labels";
import type { BudgetCategory, Vendor } from "@prisma/client";

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500";
const labelClass = "block text-sm font-medium text-slate-700 mb-1";

export function VendorForm({
  vendor,
  categories,
  action,
  submitLabel,
}: {
  vendor?: Vendor;
  categories: BudgetCategory[];
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
}) {
  return (
    <form action={action} className="space-y-5">
      <div>
        <label className={labelClass} htmlFor="name">
          Nama Vendor
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={vendor?.name}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass} htmlFor="category">
            Kategori
          </label>
          <select
            id="category"
            name="category"
            defaultValue={vendor?.category ?? "OTHER"}
            className={inputClass}
          >
            {Object.entries(VENDOR_CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="status">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={vendor?.status ?? "CONSIDERING"}
            className={inputClass}
          >
            {Object.entries(VENDOR_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass} htmlFor="contactName">
            Nama Kontak
          </label>
          <input
            id="contactName"
            name="contactName"
            type="text"
            defaultValue={vendor?.contactName ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="contactPhone">
            No. Telepon / WA
          </label>
          <input
            id="contactPhone"
            name="contactPhone"
            type="text"
            defaultValue={vendor?.contactPhone ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="contactEmail">
            Email
          </label>
          <input
            id="contactEmail"
            name="contactEmail"
            type="email"
            defaultValue={vendor?.contactEmail ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="instagram">
            Instagram
          </label>
          <input
            id="instagram"
            name="instagram"
            type="text"
            placeholder="@username"
            defaultValue={vendor?.instagram ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass} htmlFor="agreedPrice">
            Harga Disepakati (Rp)
          </label>
          <input
            id="agreedPrice"
            name="agreedPrice"
            type="number"
            min="0"
            step="1000"
            defaultValue={vendor?.agreedPrice ?? ""}
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
            defaultValue={vendor?.budgetCategoryId ?? ""}
            className={inputClass}
          >
            <option value="">Tidak terhubung</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="notes">
          Catatan
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          defaultValue={vendor?.notes ?? ""}
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        className="rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-rose-700"
      >
        {submitLabel}
      </button>
    </form>
  );
}
