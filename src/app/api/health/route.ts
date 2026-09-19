import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function redactedDatabaseUrl() {
  const raw = process.env.DATABASE_URL;
  if (!raw) return null;
  try {
    const url = new URL(raw);
    return `${url.protocol}//${url.username ? "***:***@" : ""}${url.host}${url.pathname}${url.search ? " (with query params)" : ""}`;
  } catch {
    return "unparseable DATABASE_URL";
  }
}

export async function GET() {
  const checks: Record<string, unknown> = {
    hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
    databaseUrlPreview: redactedDatabaseUrl(),
    hasSessionSecret: Boolean(process.env.SESSION_SECRET),
    hasAdminUsername: Boolean(process.env.ADMIN_USERNAME),
    hasAdminPassword: Boolean(process.env.ADMIN_PASSWORD),
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.dbConnection = "ok";
  } catch (err) {
    checks.dbConnection = "failed";
    checks.dbError =
      err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    return NextResponse.json(checks, { status: 500 });
  }

  try {
    const settingsCount = await prisma.settings.count();
    checks.settingsTableReachable = true;
    checks.settingsCount = settingsCount;
  } catch (err) {
    checks.settingsTableReachable = false;
    checks.settingsError =
      err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    return NextResponse.json(checks, { status: 500 });
  }

  return NextResponse.json(checks, { status: 200 });
}
