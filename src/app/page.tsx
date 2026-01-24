import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Package,
  Wrench,
  Users,
  BarChart3,
  AlertTriangle,
  Clock,
} from "lucide-react";


export default function HomePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">
          Panel de control
        </h1>
        <p className="text-sm text-muted-foreground">
          Resumen general del sistema
        </p>
      </div>

      {/* Atajos rápidos */}
      <section className="space-y-6 px-23">
        <h2 className="text-lg font-semibold mb-6">Accesos rápidos</h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/inventory">
            <Card className="rounded-2xl  min-h-[200px] cursor-pointer hover:shadow-sm transition">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border">
                  <Package className="h-5 w-5 text-muted-foreground" />
                </div>

                <div>
                  <CardTitle>Inventario</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Gestión de repuestos y stock
                  </p>
                </div>
              </CardHeader>

              <CardContent className="text-sm text-muted-foreground">
                Gestión de repuestos y stock
              </CardContent>
            </Card>
          </Link>

          <Link href="/workshop">
            <Card className="rounded-2xl min-h-[200px]  cursor-pointer hover:shadow-sm transition">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border">
                  <Wrench className="h-5 w-5 text-muted-foreground" />
                </div>

                <div>
                  <CardTitle>Taller</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Ordernes de repuestos y stock
                  </p>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Órdenes y operaciones de taller
              </CardContent>
            </Card>
          </Link>

          <Link href="/customers">
            <Card className="rounded-2xl  min-h-[200px]  cursor-pointer hover:shadow-sm transition">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border">
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>

                <div>
                  <CardTitle>Clientes</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Gestión de clientes
                  </p>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Gestión de clientes
              </CardContent>
            </Card>
          </Link>

          <Link href="/reports">
            <Card className="rounded-2xl min-h-[200px]  cursor-pointer hover:shadow-sm transition">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border">
                  <BarChart3 className="h-5 w-5 text-muted-foreground" />
                </div>

                <div>
                  <CardTitle>Reportes </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Reportes y métricas
                  </p>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Reportes y métricas
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* KPIs */}
      <section className="space-y-6 px-23">
        <h2 className="text-lg font-semibold mb-6">Indicadores</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="rounded-2x min-h-[200p]x">
            <CardHeader className="flex flex-row items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              <CardTitle>Repuestos sin stock</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">—</CardContent>
          </Card>

          <Card className="rounded-2xl  min-h-[200px]">
            <CardHeader className="flex flex-row items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <CardTitle>Última importación</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Próximamente
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Gafica */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 space-y-6 px-25">
        <div className="md:col-span-2 md:flex md:justify-end">
          <div className="bg-white rounded-2xl p-6 shadow-sm w-full md:w-[48%]">
            <h3 className="text-lg font-semibold mb-6">
              Actividad de importación
            </h3>

            <div className="h-64 flex items-end gap-6 border-b border-gray-200 pb-4">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-20 bg-blue-500 rounded-t-lg"></div>
                <span className="text-sm text-muted-foreground">Ene</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-32 bg-blue-500 rounded-t-lg"></div>
                <span className="text-sm text-muted-foreground">Feb</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-24 bg-blue-500 rounded-t-lg"></div>
                <span className="text-sm text-muted-foreground">Mar</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-40 bg-blue-500 rounded-t-lg"></div>
                <span className="text-sm text-muted-foreground">Abr</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-28 bg-blue-500 rounded-t-lg"></div>
                <span className="text-sm text-muted-foreground">May</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-48 bg-blue-500 rounded-t-lg"></div>
                <span className="text-sm text-muted-foreground">Jun</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
