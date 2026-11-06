"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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

function formatTime(date: Date) {
  return date.toLocaleTimeString("pt-BR", {
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
      <div className="flex items-center gap-2">
        <Image
          src="/img/pdv.png"
          alt="PDV"
          width={28}
          height={28}
          className="object-contain md:hidden"
        />
        <div className="flex flex-col leading-tight">
          <span className="text-lg font-semibold">{current?.title ?? "PDV"}</span>
          <span className="text-xs text-primary-foreground/70">
            {current?.subtitle}
          </span>
        </div>
      </div>

      <span className="shrink-0 font-mono text-xs tabular-nums sm:text-sm">
        <span className="sm:hidden">{now ? formatTime(now) : "--:--:--"}</span>
        <span className="hidden sm:inline">
          {now ? formatDateTime(now) : "--/--/---- --:--:--"}
        </span>
      </span>
    </header>
  );
}
