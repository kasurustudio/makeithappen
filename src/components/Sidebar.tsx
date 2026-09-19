"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: "home" },
  { href: "/vendors", label: "Vendor", icon: "store" },
  { href: "/budget", label: "Budget", icon: "wallet" },
  { href: "/guests", label: "Tamu", icon: "users" },
  { href: "/checklist", label: "Checklist", icon: "check" },
] as const;

function Icon({ name }: { name: string }) {
  const common = "h-5 w-5";
  switch (name) {
    case "home":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common}>
          <path
            d="M3 11.5 12 4l9 7.5M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "store":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common}>
          <path
            d="M4 9V4h16v5M4 9l1.5 4.5A2 2 0 0 0 7.4 15H8a2 2 0 0 0 2-2 2 2 0 1 0 4 0 2 2 0 0 0 2 2h.6a2 2 0 0 0 1.9-1.5L20 9M4 9h16M6 15v5h12v-5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "wallet":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common}>
          <path
            d="M3 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="M16 12h3M3 9h18"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );
    case "users":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common}>
          <path
            d="M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM8.5 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM2 19c.5-3 3-5 6.5-5s6 2 6.5 5M13 14.2c2.7.4 4.6 2 5 4.8"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "check":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common}>
          <path
            d="M9 12.5 11.5 15 16 9.5M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    default:
      return null;
  }
}

export default function Sidebar({
  orientation = "vertical",
}: {
  orientation?: "vertical" | "horizontal";
}) {
  const pathname = usePathname();
  const isHorizontal = orientation === "horizontal";

  return (
    <nav
      className={
        isHorizontal
          ? "flex items-center justify-between gap-1"
          : "flex flex-col gap-1 p-3"
      }
    >
      {NAV_ITEMS.map((item) => {
        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              isHorizontal
                ? `flex flex-1 flex-col items-center gap-0.5 rounded-lg py-1.5 text-[11px] font-medium transition-colors ${
                    active ? "text-rose-600" : "text-slate-500"
                  }`
                : `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-rose-600 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`
            }
          >
            <Icon name={item.icon} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
