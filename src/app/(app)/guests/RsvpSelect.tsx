"use client";

import { RSVP_STATUS_LABELS } from "@/lib/labels";
import type { RsvpStatus } from "@prisma/client";

const STATUSES = Object.keys(RSVP_STATUS_LABELS) as RsvpStatus[];

export function RsvpSelect({
  defaultValue,
  action,
}: {
  defaultValue: RsvpStatus;
  action: (formData: FormData) => void | Promise<void>;
}) {
  return (
    <form action={action}>
      <select
        name="rsvpStatus"
        defaultValue={defaultValue}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="rounded-full border-0 bg-transparent text-xs font-medium text-slate-700"
      >
        {STATUSES.map((status) => (
          <option key={status} value={status}>
            {RSVP_STATUS_LABELS[status]}
          </option>
        ))}
      </select>
    </form>
  );
}
