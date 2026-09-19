import type {
  GuestSide,
  RsvpStatus,
  TaskPriority,
  TaskStatus,
  VendorCategory,
  VendorStatus,
} from "@prisma/client";

export const VENDOR_CATEGORY_LABELS: Record<VendorCategory, string> = {
  VENUE: "Venue",
  CATERING: "Catering",
  PHOTOGRAPHY: "Fotografi",
  VIDEOGRAPHY: "Videografi",
  DECORATION: "Dekorasi",
  MAKEUP_ARTIST: "MUA",
  ATTIRE: "Busana",
  MUSIC_ENTERTAINMENT: "Musik & Hiburan",
  INVITATION: "Undangan",
  SOUVENIR: "Souvenir",
  WEDDING_ORGANIZER: "Wedding Organizer",
  TRANSPORTATION: "Transportasi",
  OTHER: "Lainnya",
};

export const VENDOR_STATUS_LABELS: Record<VendorStatus, string> = {
  CONSIDERING: "Dipertimbangkan",
  CONTACTED: "Sudah Dihubungi",
  NEGOTIATING: "Negosiasi",
  BOOKED: "Booked",
  PAID_IN_FULL: "Lunas",
  CANCELLED: "Dibatalkan",
};

export const VENDOR_STATUS_COLORS: Record<
  VendorStatus,
  "slate" | "amber" | "blue" | "green" | "rose" | "red" | "purple"
> = {
  CONSIDERING: "slate",
  CONTACTED: "blue",
  NEGOTIATING: "amber",
  BOOKED: "purple",
  PAID_IN_FULL: "green",
  CANCELLED: "red",
};

export const RSVP_STATUS_LABELS: Record<RsvpStatus, string> = {
  PENDING: "Belum Konfirmasi",
  ATTENDING: "Hadir",
  NOT_ATTENDING: "Tidak Hadir",
  MAYBE: "Mungkin",
};

export const RSVP_STATUS_COLORS: Record<
  RsvpStatus,
  "slate" | "amber" | "blue" | "green" | "rose" | "red" | "purple"
> = {
  PENDING: "slate",
  ATTENDING: "green",
  NOT_ATTENDING: "red",
  MAYBE: "amber",
};

export const GUEST_SIDE_LABELS: Record<GuestSide, string> = {
  BRIDE: "Mempelai Wanita",
  GROOM: "Mempelai Pria",
  BOTH: "Bersama",
};

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  TODO: "Belum Dikerjakan",
  IN_PROGRESS: "Sedang Berjalan",
  DONE: "Selesai",
};

export const TASK_STATUS_COLORS: Record<
  TaskStatus,
  "slate" | "amber" | "blue" | "green" | "rose" | "red" | "purple"
> = {
  TODO: "slate",
  IN_PROGRESS: "amber",
  DONE: "green",
};

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  LOW: "Rendah",
  MEDIUM: "Sedang",
  HIGH: "Tinggi",
};

export const TASK_PRIORITY_COLORS: Record<
  TaskPriority,
  "slate" | "amber" | "blue" | "green" | "rose" | "red" | "purple"
> = {
  LOW: "slate",
  MEDIUM: "blue",
  HIGH: "red",
};
