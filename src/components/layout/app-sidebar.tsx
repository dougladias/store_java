"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { navItems } from "./nav-items";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-16 shrink-0 flex-col items-center bg-sidebar md:flex">
      <div className="flex h-16 w-full shrink-0 items-center justify-center">
        <Image src="/img/pdv.png" alt="PDV" width={36} height={36} className="object-contain" />
      </div>
      <Separator className="bg-sidebar-border" />
      <div className="flex flex-1 flex-col items-center gap-2 py-4">
        <TooltipProvider>
          {navItems.map((item) => {
            const isActive = pathname === item.url;
            return (
              <Tooltip key={item.url}>
                <TooltipTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      nativeButton={false}
                      render={<Link href={item.url} aria-label={item.title} />}
                      className={cn(
                        "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                        isActive && "bg-sidebar-accent text-sidebar-primary"
                      )}
                    />
                  }
                >
                  <item.icon />
                </TooltipTrigger>
                <TooltipContent side="right">{item.title}</TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </div>
    </aside>
  );
}
