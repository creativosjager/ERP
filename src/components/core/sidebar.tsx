"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Boxes,
  Wrench,
  Users,
  BarChart3,
  Settings,
} from "lucide-react";

const nav = [
  { href: "/inventory", label: "Inventario", icon: Boxes },
  { href: "/workshop", label: "Taller (OT)", icon: Wrench },
  { href: "/customers", label: "Clientes", icon: Users },
  { href: "/reports", label: "Reportes", icon: BarChart3 },
  { href: "/settings", label: "Configuracion", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-background p-4">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">JAGER CORE</h2>
        <p className="text-xs text-muted-foreground">
          Intranet operativa
        </p>
      </div>

      <nav className="space-y-1">
        {nav.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
