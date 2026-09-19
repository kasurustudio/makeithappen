"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

function parseOptionalString(value: FormDataEntryValue | null) {
  const s = value ? String(value).trim() : "";
  return s === "" ? null : s;
}

export async function createBudgetCategory(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const plannedAmount = Number(formData.get("plannedAmount") ?? 0);
  if (!name) throw new Error("Nama kategori wajib diisi");

  await prisma.budgetCategory.create({
    data: { name, plannedAmount: Number.isNaN(plannedAmount) ? 0 : plannedAmount },
  });

  revalidatePath("/budget");
  revalidatePath("/");
}

export async function updateBudgetCategory(id: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const plannedAmount = Number(formData.get("plannedAmount") ?? 0);
  if (!name) throw new Error("Nama kategori wajib diisi");

  await prisma.budgetCategory.update({
    where: { id },
    data: { name, plannedAmount: Number.isNaN(plannedAmount) ? 0 : plannedAmount },
  });

  revalidatePath("/budget");
  revalidatePath("/");
}

export async function deleteBudgetCategory(id: string) {
  await prisma.budgetCategory.delete({ where: { id } });
  revalidatePath("/budget");
  revalidatePath("/");
}

export async function addPayment(formData: FormData) {
  const amount = Number(formData.get("amount"));
  const label = String(formData.get("label") ?? "").trim();
  if (!label || Number.isNaN(amount) || amount <= 0) {
    throw new Error("Label dan nominal wajib diisi dengan benar");
  }

  const paidAtRaw = String(formData.get("paidAt") ?? "");
  const budgetCategoryId = parseOptionalString(formData.get("budgetCategoryId"));
  const vendorId = parseOptionalString(formData.get("vendorId"));

  await prisma.payment.create({
    data: {
      amount,
      label,
      paidAt: paidAtRaw ? new Date(paidAtRaw) : new Date(),
      budgetCategoryId,
      vendorId,
      notes: parseOptionalString(formData.get("notes")),
    },
  });

  revalidatePath("/budget");
  revalidatePath("/");
}

export async function deletePayment(id: string) {
  await prisma.payment.delete({ where: { id } });
  revalidatePath("/budget");
  revalidatePath("/");
}

export async function updateSettings(formData: FormData) {
  const totalBudget = Number(formData.get("totalBudget") ?? 0);
  const weddingDateRaw = String(formData.get("weddingDate") ?? "");
  const brideName = parseOptionalString(formData.get("brideName"));
  const groomName = parseOptionalString(formData.get("groomName"));

  const existing = await prisma.settings.findFirst();
  const data = {
    totalBudget: Number.isNaN(totalBudget) ? 0 : totalBudget,
    weddingDate: weddingDateRaw ? new Date(weddingDateRaw) : null,
    brideName,
    groomName,
  };

  if (existing) {
    await prisma.settings.update({ where: { id: existing.id }, data });
  } else {
    await prisma.settings.create({ data });
  }

  revalidatePath("/budget");
  revalidatePath("/");
}
