"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { TaskPriority, TaskStatus } from "@prisma/client";

function parseOptionalString(value: FormDataEntryValue | null) {
  const s = value ? String(value).trim() : "";
  return s === "" ? null : s;
}

function buildData(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  if (!title) throw new Error("Judul tugas wajib diisi");
  const dueDateRaw = String(formData.get("dueDate") ?? "");

  return {
    title,
    category: parseOptionalString(formData.get("category")),
    dueDate: dueDateRaw ? new Date(dueDateRaw) : null,
    status: String(formData.get("status")) as TaskStatus,
    priority: String(formData.get("priority")) as TaskPriority,
    notes: parseOptionalString(formData.get("notes")),
  };
}

export async function createTask(formData: FormData) {
  await prisma.checklistTask.create({ data: buildData(formData) });
  revalidatePath("/checklist");
  revalidatePath("/");
  redirect("/checklist");
}

export async function updateTask(id: string, formData: FormData) {
  await prisma.checklistTask.update({ where: { id }, data: buildData(formData) });
  revalidatePath("/checklist");
  revalidatePath("/");
  redirect("/checklist");
}

export async function deleteTask(id: string) {
  await prisma.checklistTask.delete({ where: { id } });
  revalidatePath("/checklist");
  revalidatePath("/");
}

export async function quickUpdateTaskStatus(id: string, formData: FormData) {
  const status = String(formData.get("status")) as TaskStatus;
  await prisma.checklistTask.update({ where: { id }, data: { status } });
  revalidatePath("/checklist");
  revalidatePath("/");
}
