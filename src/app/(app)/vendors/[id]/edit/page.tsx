import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { VendorForm } from "../../VendorForm";
import { updateVendor } from "../../actions";

export default async function EditVendorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [vendor, categories] = await Promise.all([
    prisma.vendor.findUnique({ where: { id } }),
    prisma.budgetCategory.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!vendor) notFound();

  const boundUpdate = updateVendor.bind(null, id);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Edit Vendor</h1>
        <p className="text-sm text-slate-500 mt-1">{vendor.name}</p>
      </div>
      <Card>
        <VendorForm
          vendor={vendor}
          categories={categories}
          action={boundUpdate}
          submitLabel="Simpan Perubahan"
        />
      </Card>
    </div>
  );
}
