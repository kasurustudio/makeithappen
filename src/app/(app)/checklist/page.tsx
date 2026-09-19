import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/format";
import {
  TASK_PRIORITY_COLORS,
  TASK_PRIORITY_LABELS,
  TASK_STATUS_LABELS,
} from "@/lib/labels";
import { deleteTask, quickUpdateTaskStatus } from "./actions";
import { StatusSelect } from "./StatusSelect";
import type { TaskStatus } from "@prisma/client";

const STATUS_ORDER: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];

export default async function ChecklistPage() {
  const tasks = await prisma.checklistTask.findMany({
    orderBy: [{ dueDate: "asc" }, { priority: "desc" }],
  });

  const grouped = STATUS_ORDER.map((status) => ({
    status,
    tasks: tasks.filter((t) => t.status === status),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Checklist</h1>
          <p className="text-sm text-slate-500 mt-1">
            Timeline & to-do list persiapan pernikahan.
          </p>
        </div>
        <Link
          href="/checklist/new"
          className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-rose-700"
        >
          + Tambah Tugas
        </Link>
      </div>

      {tasks.length === 0 ? (
        <Card>
          <p className="text-sm text-slate-400">
            Belum ada tugas. Tambahkan checklist pertamamu.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {grouped.map(({ status, tasks: groupTasks }) => (
            <div key={status} className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-sm font-semibold text-slate-700">
                  {TASK_STATUS_LABELS[status]}
                </h2>
                <span className="text-xs text-slate-400">
                  {groupTasks.length}
                </span>
              </div>
              {groupTasks.length === 0 ? (
                <p className="text-xs text-slate-300 px-1">Tidak ada tugas</p>
              ) : (
                groupTasks.map((task) => {
                  const boundQuickUpdate = quickUpdateTaskStatus.bind(
                    null,
                    task.id
                  );
                  const boundDelete = deleteTask.bind(null, task.id);
                  return (
                    <Card key={task.id}>
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-slate-800">
                          {task.title}
                        </p>
                        <Badge color={TASK_PRIORITY_COLORS[task.priority]}>
                          {TASK_PRIORITY_LABELS[task.priority]}
                        </Badge>
                      </div>
                      <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-400">
                        {task.category && <span>{task.category}</span>}
                        {task.dueDate && (
                          <span>· {formatDate(task.dueDate)}</span>
                        )}
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <StatusSelect
                          defaultValue={task.status}
                          action={boundQuickUpdate}
                        />
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/checklist/${task.id}/edit`}
                            className="text-xs font-medium text-rose-600 hover:underline"
                          >
                            Edit
                          </Link>
                          <form action={boundDelete}>
                            <button
                              type="submit"
                              className="text-xs text-red-500 hover:underline"
                            >
                              Hapus
                            </button>
                          </form>
                        </div>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
