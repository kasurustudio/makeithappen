"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { GuestSide, RsvpStatus } from "@prisma/client";

function parseOptionalString(value: FormDataEntryValue | null) {
  const s = value ? String(value).trim() : "";
  return s === "" ? null : s;
}

function buildData(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("Nama tamu wajib diisi");
  const pax = Number(formData.get("pax") ?? 1);

  return {
    name,
    side: String(formData.get("side")) as GuestSide,
    group: parseOptionalString(formData.get("group")),
    phone: parseOptionalString(formData.get("phone")),
    pax: Number.isNaN(pax) || pax < 1 ? 1 : pax,
    rsvpStatus: String(formData.get("rsvpStatus")) as RsvpStatus,
    tableNumber: parseOptionalString(formData.get("tableNumber")),
    invitationSent: formData.get("invitationSent") === "on",
    notes: parseOptionalString(formData.get("notes")),
  };
}

export async function createGuest(formData: FormData) {
  await prisma.guest.create({ data: buildData(formData) });
  revalidatePath("/guests");
  revalidatePath("/");
  redirect("/guests");
}

export async function updateGuest(id: string, formData: FormData) {
  await prisma.guest.update({ where: { id }, data: buildData(formData) });
  revalidatePath("/guests");
  revalidatePath("/");
  redirect("/guests");
}

export async function deleteGuest(id: string) {
  await prisma.guest.delete({ where: { id } });
  revalidatePath("/guests");
  revalidatePath("/");
}

export async function quickUpdateRsvp(id: string, formData: FormData) {
  const rsvpStatus = String(formData.get("rsvpStatus")) as RsvpStatus;
  await prisma.guest.update({ where: { id }, data: { rsvpStatus } });
  revalidatePath("/guests");
  revalidatePath("/");
}
