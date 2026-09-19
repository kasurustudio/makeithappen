import { GUEST_SIDE_LABELS, RSVP_STATUS_LABELS } from "@/lib/labels";
import type { Guest } from "@prisma/client";

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500";
const labelClass = "block text-sm font-medium text-slate-700 mb-1";

export function GuestForm({
  guest,
  action,
  submitLabel,
}: {
  guest?: Guest;
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
}) {
  return (
    <form action={action} className="space-y-5">
      <div>
        <label className={labelClass} htmlFor="name">
          Nama Tamu
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={guest?.name}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass} htmlFor="side">
            Pihak
          </label>
          <select
            id="side"
            name="side"
            defaultValue={guest?.side ?? "BOTH"}
            className={inputClass}
          >
            {Object.entries(GUEST_SIDE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="group">
            Grup (mis. Keluarga, Teman Kantor)
          </label>
          <input
            id="group"
            name="group"
            type="text"
            defaultValue={guest?.group ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="phone">
            No. Telepon / WA
          </label>
          <input
            id="phone"
            name="phone"
            type="text"
            defaultValue={guest?.phone ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="pax">
            Jumlah Pax
          </label>
          <input
            id="pax"
            name="pax"
            type="number"
            min="1"
            defaultValue={guest?.pax ?? 1}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="rsvpStatus">
            Status RSVP
          </label>
          <select
            id="rsvpStatus"
            name="rsvpStatus"
            defaultValue={guest?.rsvpStatus ?? "PENDING"}
            className={inputClass}
          >
            {Object.entries(RSVP_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="tableNumber">
            Nomor Meja
          </label>
          <input
            id="tableNumber"
            name="tableNumber"
            type="text"
            defaultValue={guest?.tableNumber ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="invitationSent"
          name="invitationSent"
          type="checkbox"
          defaultChecked={guest?.invitationSent}
          className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500"
        />
        <label htmlFor="invitationSent" className="text-sm text-slate-700">
          Undangan sudah dikirim
        </label>
      </div>

      <div>
        <label className={labelClass} htmlFor="notes">
          Catatan
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          defaultValue={guest?.notes ?? ""}
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
