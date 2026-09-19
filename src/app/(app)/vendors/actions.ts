"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { VendorCategory, VendorStatus } from "@prisma/client";

function parseOptionalFloat(value: FormDataEntryValue | null) {
  if (!value || String(value).trim() === "") return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
}

function parseOptionalString(value: FormDataEntryValue | null) {
  const s = value ? String(value).trim() : "";
  return s === "" ? null : s;
}

export async function createVendor(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("Nama vendor wajib diisi");

  await prisma.vendor.create({
    data: {
      name,
      category: String(formData.get("category")) as VendorCategory,
      status: String(formData.get("status")) as VendorStatus,
      contactName: parseOptionalString(formData.get("contactName")),
      contactPhone: parseOptionalString(formData.get("contactPhone")),
      contactEmail: parseOptionalString(formData.get("contactEmail")),
      instagram: parseOptionalString(formData.get("instagram")),
      agreedPrice: parseOptionalFloat(formData.get("agreedPrice")),
      notes: parseOptionalString(formData.get("notes")),
      budgetCategoryId: parseOptionalString(formData.get("budgetCategoryId")),
    },
  });

  revalidatePath("/vendors");
  revalidatePath("/");
  redirect("/vendors");
}

export async function updateVendor(id: string, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("Nama vendor wajib diisi");

  await prisma.vendor.update({
    where: { id },
    data: {
      name,
      category: String(formData.get("category")) as VendorCategory,
      status: String(formData.get("status")) as VendorStatus,
      contactName: parseOptionalString(formData.get("contactName")),
      contactPhone: parseOptionalString(formData.get("contactPhone")),
      contactEmail: parseOptionalString(formData.get("contactEmail")),
      instagram: parseOptionalString(formData.get("instagram")),
      agreedPrice: parseOptionalFloat(formData.get("agreedPrice")),
      notes: parseOptionalString(formData.get("notes")),
      budgetCategoryId: parseOptionalString(formData.get("budgetCategoryId")),
    },
  });

  revalidatePath("/vendors");
  revalidatePath(`/vendors/${id}`);
  revalidatePath("/");
  redirect(`/vendors/${id}`);
}

export async function deleteVendor(id: string) {
  await prisma.vendor.delete({ where: { id } });
  revalidatePath("/vendors");
  revalidatePath("/");
  redirect("/vendors");
}

export async function addVendorPayment(vendorId: string, formData: FormData) {
  const amount = Number(formData.get("amount"));
  const label = String(formData.get("label") ?? "").trim();
  if (!label || Number.isNaN(amount) || amount <= 0) {
    throw new Error("Label dan nominal pembayaran wajib diisi dengan benar");
  }

  const paidAtRaw = String(formData.get("paidAt") ?? "");
  const vendor = await prisma.vendor.findUnique({ where: { id: vendorId } });

  await prisma.payment.create({
    data: {
      amount,
      label,
      paidAt: paidAtRaw ? new Date(paidAtRaw) : new Date(),
      vendorId,
      budgetCategoryId: vendor?.budgetCategoryId ?? null,
      notes: parseOptionalString(formData.get("notes")),
    },
  });

  revalidatePath(`/vendors/${vendorId}`);
  revalidatePath("/budget");
  revalidatePath("/");
}

export async function deleteVendorPayment(vendorId: string, paymentId: string) {
  await prisma.payment.delete({ where: { id: paymentId } });
  revalidatePath(`/vendors/${vendorId}`);
  revalidatePath("/budget");
  revalidatePath("/");
}
