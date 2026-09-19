import {
  TASK_PRIORITY_LABELS,
  TASK_STATUS_LABELS,
} from "@/lib/labels";
import { formatDateInput } from "@/lib/format";
import type { ChecklistTask } from "@prisma/client";

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500";
const labelClass = "block text-sm font-medium text-slate-700 mb-1";

export function ChecklistForm({
  task,
  action,
  submitLabel,
}: {
  task?: ChecklistTask;
  action: (formData: FormData) => void | Promise<void>;
  submitLabel: string;
}) {
  return (
    <form action={action} className="space-y-5">
      <div>
        <label className={labelClass} htmlFor="title">
          Judul Tugas
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={task?.title}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass} htmlFor="category">
            Kategori
          </label>
          <input
            id="category"
            name="category"
            type="text"
            placeholder="mis. Venue, Dokumen, Undangan"
            defaultValue={task?.category ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="dueDate">
            Tenggat Waktu
          </label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            defaultValue={formatDateInput(task?.dueDate)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="status">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={task?.status ?? "TODO"}
            className={inputClass}
          >
            {Object.entries(TASK_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="priority">
            Prioritas
          </label>
          <select
            id="priority"
            name="priority"
            defaultValue={task?.priority ?? "MEDIUM"}
            className={inputClass}
          >
            {Object.entries(TASK_PRIORITY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
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
          defaultValue={task?.notes ?? ""}
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
