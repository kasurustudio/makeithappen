import Sidebar from "@/components/Sidebar";
import { getSettings } from "@/lib/settings";
import { logoutAction } from "./actions";

export const dynamic = "force-dynamic";

function daysUntil(date: Date | null) {
  if (!date) return null;
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.round((target.getTime() - start.getTime()) / 86_400_000);
}

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  const days = daysUntil(settings.weddingDate);
  const coupleName =
    settings.brideName && settings.groomName
      ? `${settings.brideName} & ${settings.groomName}`
      : null;

  return (
    <div className="flex min-h-screen w-full">
      <aside className="hidden md:flex w-64 flex-col border-r border-slate-200 bg-white">
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-slate-200">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-600 text-white text-sm font-bold">
            M
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 leading-tight">
              Make It Happen
            </p>
            <p className="text-xs text-slate-400 leading-tight">
              Wedding Backoffice
            </p>
          </div>
        </div>
        <Sidebar />
        <div className="mt-auto p-4">
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50"
            >
              Keluar
            </button>
          </form>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 md:px-8 py-4">
          <div className="md:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-600 text-white text-sm font-bold">
              M
            </div>
          </div>
          <div className="min-w-0">
            {coupleName && (
              <p className="text-sm font-medium text-slate-900 truncate">
                {coupleName}
              </p>
            )}
            {days !== null && (
              <p className="text-xs text-slate-500">
                {days > 0
                  ? `H-${days} menuju hari bahagia`
                  : days === 0
                    ? "Hari ini hari bahagianya!"
                    : "Sudah menikah, selamat!"}
              </p>
            )}
          </div>
          <form action={logoutAction} className="md:hidden">
            <button
              type="submit"
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-500"
            >
              Keluar
            </button>
          </form>
        </header>
        <main className="flex-1 px-4 md:px-8 py-6 md:py-8">{children}</main>

        <nav className="md:hidden sticky bottom-0 border-t border-slate-200 bg-white px-2 py-2">
          <Sidebar orientation="horizontal" />
        </nav>
      </div>
    </div>
  );
}
