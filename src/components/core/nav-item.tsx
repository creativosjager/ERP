"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export default function NavItem({
  href,
  label,
  Icon,
  onClick,
}: {
  href: string;
  label: string;
  Icon: LucideIcon;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
        isActive
          ? "bg-accent text-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-foreground"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon className="h-4 w-4" />
      {label}
      {isActive && (
        <span className="ml-auto h-2 w-2 rounded-full bg-[var(--jager-accent)]" />
      )}
    </Link>
  );
}
