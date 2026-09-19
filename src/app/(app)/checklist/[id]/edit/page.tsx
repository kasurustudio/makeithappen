import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { ChecklistForm } from "../../ChecklistForm";
import { updateTask } from "../../actions";

export default async function EditTaskPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const task = await prisma.checklistTask.findUnique({ where: { id } });
  if (!task) notFound();

  const boundUpdate = updateTask.bind(null, id);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Edit Tugas</h1>
        <p className="text-sm text-slate-500 mt-1">{task.title}</p>
      </div>
      <Card>
        <ChecklistForm
          task={task}
          action={boundUpdate}
          submitLabel="Simpan Perubahan"
        />
      </Card>
    </div>
  );
}
