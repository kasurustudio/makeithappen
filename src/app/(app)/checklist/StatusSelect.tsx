"use client";

import { TASK_STATUS_LABELS } from "@/lib/labels";
import type { TaskStatus } from "@prisma/client";

const STATUSES = Object.keys(TASK_STATUS_LABELS) as TaskStatus[];

export function StatusSelect({
  defaultValue,
  action,
}: {
  defaultValue: TaskStatus;
  action: (formData: FormData) => void | Promise<void>;
}) {
  return (
    <form action={action}>
      <select
        name="status"
        defaultValue={defaultValue}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="rounded-full border-0 bg-transparent text-xs font-medium text-slate-700"
      >
        {STATUSES.map((status) => (
          <option key={status} value={status}>
            {TASK_STATUS_LABELS[status]}
          </option>
        ))}
      </select>
    </form>
  );
}
