"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Bell, Menu, Search, LayoutGrid, Package, Wrench, Users, BarChart3, Settings } from "lucide-react";
import NavItem from "@/components/core/nav-item";
import { useState } from "react";

const nav = [
  { href: "/inventory", label: "Inventario", icon: Package },
  { href: "/workshop", label: "Taller (OT)", icon: Wrench },
  { href: "/customers", label: "Clientes", icon: Users },
  { href: "/reports", label: "Reportes", icon: BarChart3 },
  { href: "/settings", label: "Configuración", icon: Settings },
];

export default function Topbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-10 border-b bg-background/70 backdrop-blur">
      <div className="flex items-center justify-between gap-3 px-4 py-3 md:px-6">
        <div className="flex items-center gap-2">
          {/* Mobile menu */}
          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Abrir menú">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              <SheetContent side="left" className="w-80 p-0">
                <div className="border-b p-4">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-xl border bg-card">
                        <LayoutGrid className="h-5 w-5" />
                      </div>
                      <div className="leading-tight">
                        <div className="text-sm font-semibold tracking-tight">JAGER CORE</div>
                        <div className="text-xs text-muted-foreground">Intranet Operativa</div>
                      </div>
                    </SheetTitle>
                  </SheetHeader>
                </div>

                <nav className="px-2 py-2 space-y-1">
                  {nav.map((item) => (
                    <NavItem
                      key={item.href}
                      href={item.href}
                      label={item.label}
                      Icon={item.icon}
                      onClick={() => setOpen(false)}
                    />
                  ))}
                </nav>

                <div className="mt-auto p-4">
                  <div className="rounded-xl border bg-card/40 p-3 text-xs text-muted-foreground">
                    <div className="font-medium text-foreground">Domina la ciudad.</div>
                    <div>Todo queda registrado en CORE.</div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Search */}
          <div className="flex w-full max-w-md items-center gap-2 rounded-xl border bg-card/30 px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              placeholder="Buscar OT, cliente, serial, repuesto…"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Notificaciones">
            <Bell className="h-4 w-4" />
          </Button>
          <div className="h-9 w-9 rounded-full border bg-card" />
        </div>
      </div>
    </header>
  );
}
