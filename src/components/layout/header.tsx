"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { navItems } from "./nav-items";

function formatDateTime(date: Date) {
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function useClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return now;
}

export function Header() {
  const now = useClock();
  const pathname = usePathname();
  const current = navItems.find((item) => item.url === pathname);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-sidebar-border bg-primary px-4 text-primary-foreground">
      <div className="flex flex-col leading-tight">
        <span className="text-lg font-semibold">{current?.title ?? "PDV"}</span>
        <span className="text-xs text-primary-foreground/70">
          {current?.subtitle}
        </span>
      </div>

      <span className="font-mono text-sm tabular-nums">
        {now ? formatDateTime(now) : "--/--/---- --:--:--"}
      </span>
    </header>
  );
}
