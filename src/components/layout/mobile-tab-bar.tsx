"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navItems } from "./nav-items";

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav className="flex shrink-0 border-t border-sidebar-border bg-sidebar md:hidden">
      {navItems.map((item) => {
        const isActive = pathname === item.url;
        return (
          <Link
            key={item.url}
            href={item.url}
            className={cn(
              "flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] leading-tight text-sidebar-foreground/70",
              isActive && "text-sidebar-primary"
            )}
          >
            <item.icon className="size-5" />
            <span className="text-center">{item.tabLabel}</span>
          </Link>
        );
      })}
    </nav>
  );
}
