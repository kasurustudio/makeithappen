import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { VendorForm } from "../VendorForm";
import { createVendor } from "../actions";

export default async function NewVendorPage() {
  const categories = await prisma.budgetCategory.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          Tambah Vendor
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Simpan informasi vendor baru.
        </p>
      </div>
      <Card>
        <VendorForm
          categories={categories}
          action={createVendor}
          submitLabel="Simpan Vendor"
        />
      </Card>
    </div>
  );
}
