import LoginForm from "./LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const params = await searchParams;
  const from = params.from ?? "/";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-amber-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-600 text-white text-xl font-bold mb-4">
            M
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Make It Happen
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Backoffice persiapan pernikahan
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <LoginForm from={from} />
        </div>
      </div>
    </div>
  );
}
