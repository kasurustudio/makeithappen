const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.settings.findFirst();
  if (existing) {
    console.log("Database sudah berisi data, seed dibatalkan.");
    return;
  }

  await prisma.settings.create({
    data: {
      brideName: "Sarah",
      groomName: "Andi",
      weddingDate: new Date("2026-12-12"),
      totalBudget: 350000000,
    },
  });

  const venue = await prisma.budgetCategory.create({
    data: { name: "Venue", plannedAmount: 150000000 },
  });
  const catering = await prisma.budgetCategory.create({
    data: { name: "Catering", plannedAmount: 80000000 },
  });
  const decoration = await prisma.budgetCategory.create({
    data: { name: "Dekorasi", plannedAmount: 40000000 },
  });
  const photo = await prisma.budgetCategory.create({
    data: { name: "Fotografi & Video", plannedAmount: 35000000 },
  });

  const vendor1 = await prisma.vendor.create({
    data: {
      name: "Grand Ballroom Hotel Mulia",
      category: "VENUE",
      status: "BOOKED",
      contactName: "Budi Santoso",
      contactPhone: "0812-3456-7890",
      contactEmail: "budi@grandballroom.id",
      instagram: "@grandballroom.mulia",
      agreedPrice: 145000000,
      notes: "Sudah DP 30%, sisa dibayar H-14",
      budgetCategoryId: venue.id,
    },
  });
  await prisma.vendor.create({
    data: {
      name: "Sedap Catering",
      category: "CATERING",
      status: "NEGOTIATING",
      contactName: "Rina",
      contactPhone: "0813-2233-4455",
      agreedPrice: 75000000,
      notes: "Nego paket 500 pax, masih tunggu revisi menu",
      budgetCategoryId: catering.id,
    },
  });
  const vendor3 = await prisma.vendor.create({
    data: {
      name: "Bloom & Co Decoration",
      category: "DECORATION",
      status: "CONTACTED",
      contactName: "Dewi",
      contactPhone: "0857-1111-2222",
      instagram: "@bloomandco",
      budgetCategoryId: decoration.id,
    },
  });
  const vendor4 = await prisma.vendor.create({
    data: {
      name: "Capture Moments Studio",
      category: "PHOTOGRAPHY",
      status: "PAID_IN_FULL",
      contactName: "Fajar",
      contactPhone: "0821-9988-7766",
      agreedPrice: 32000000,
      budgetCategoryId: photo.id,
    },
  });
  await prisma.vendor.create({
    data: {
      name: "Melati Wedding Organizer",
      category: "WEDDING_ORGANIZER",
      status: "CONSIDERING",
      contactName: "Ayu",
      contactPhone: "0811-4444-5555",
    },
  });
  await prisma.vendor.create({
    data: {
      name: "Griya Pengantin MUA",
      category: "MAKEUP_ARTIST",
      status: "BOOKED",
      contactName: "Lala",
      contactPhone: "0819-6677-8899",
      agreedPrice: 12000000,
    },
  });

  await prisma.payment.createMany({
    data: [
      { amount: 43500000, label: "DP 30%", vendorId: vendor1.id, budgetCategoryId: venue.id, paidAt: new Date("2026-06-01") },
      { amount: 32000000, label: "Pelunasan", vendorId: vendor4.id, budgetCategoryId: photo.id, paidAt: new Date("2026-07-15") },
      { amount: 10000000, label: "DP Dekorasi", vendorId: vendor3.id, budgetCategoryId: decoration.id, paidAt: new Date("2026-08-01") },
    ],
  });

  const guestData = [
    ["Keluarga Besar Ayah", "BOTH", "Keluarga", 8, "ATTENDING"],
    ["Keluarga Besar Ibu", "BOTH", "Keluarga", 6, "ATTENDING"],
    ["Teman Kuliah Sarah", "BRIDE", "Teman", 4, "PENDING"],
    ["Teman Kantor Andi", "GROOM", "Kolega", 5, "MAYBE"],
    ["Sahabat SMA", "BOTH", "Teman", 3, "ATTENDING"],
    ["Tetangga Komplek", "BOTH", "Tetangga", 4, "PENDING"],
    ["Om Budi & Keluarga", "BRIDE", "Keluarga", 4, "NOT_ATTENDING"],
    ["Tante Sinta", "GROOM", "Keluarga", 2, "ATTENDING"],
  ];
  for (const [name, side, group, pax, rsvpStatus] of guestData) {
    await prisma.guest.create({
      data: {
        name,
        side,
        group,
        pax,
        rsvpStatus,
        invitationSent: rsvpStatus !== "PENDING",
        tableNumber:
          rsvpStatus === "ATTENDING" ? String(Math.ceil(Math.random() * 10)) : null,
      },
    });
  }

  const taskData = [
    ["Survey & booking venue", "Venue", "DONE", "HIGH", "2026-06-15"],
    ["Tasting menu catering", "Catering", "IN_PROGRESS", "HIGH", "2026-10-01"],
    ["Cetak undangan digital", "Undangan", "TODO", "MEDIUM", "2026-10-15"],
    ["Fitting baju pengantin", "Busana", "TODO", "HIGH", "2026-11-01"],
    ["Booking MUA untuk rias keluarga", "Kecantikan", "TODO", "MEDIUM", "2026-11-10"],
    ["Konfirmasi final guest list", "Tamu", "TODO", "HIGH", "2026-11-20"],
    ["Rapat teknis dengan WO", "Koordinasi", "TODO", "MEDIUM", "2026-12-01"],
    ["Siapkan souvenir tamu", "Souvenir", "IN_PROGRESS", "LOW", "2026-11-25"],
  ];
  for (const [title, category, status, priority, dueDate] of taskData) {
    await prisma.checklistTask.create({
      data: { title, category, status, priority, dueDate: new Date(dueDate) },
    });
  }

  console.log("Seed selesai.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
