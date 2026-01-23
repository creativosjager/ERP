import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Boxes, Wrench, Users, BarChart3, Settings } from "lucide-react";

function Tile({
  title,
  desc,
  href,
  Icon,
}: {
  title: string;
  desc: string;
  href: string;
  Icon: any;
}) {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Icon className="h-4 w-4" /> {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{desc}</p>
        <Button asChild variant="outline" className="w-full rounded-xl">
          <Link href={href} className="inline-flex items-center justify-center gap-2">
            Abrir <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function CoreHome() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Centro de control de JAGER CORE (intranet operativa).
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        <Tile
          title="Inventario"
          desc="Repuestos, stock y precios. Importacion por archivo."
          href="/inventory"
          Icon={Boxes}
        />
        <Tile
          title="Taller (OT)"
          desc="Entradas, estado, observaciones y seguimiento."
          href="/workshop"
          Icon={Wrench}
        />
        <Tile
          title="Clientes"
          desc="Datos del dueno, telefono e historial."
          href="/customers"
          Icon={Users}
        />
        <Tile
          title="Reportes"
          desc="Vista de reportes y auditoria (solo lectura)."
          href="/reports"
          Icon={BarChart3}
        />
        <Tile
          title="Configuracion"
          desc="Usuarios, roles, parametros y conexiones futuras."
          href="/settings"
          Icon={Settings}
        />
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">Siguiente paso</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Crear modulo de Taller (OT) y luego roles (Admin, Taller, Reportes).
        </CardContent>
      </Card>
    </div>
  );
}
