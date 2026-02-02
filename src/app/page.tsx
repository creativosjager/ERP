﻿import Kpicard from "@/components/core/KpiCard";
import { metrics } from "@/lib/metrics";
import { BarChart3, Calendar1, ChartColumn, Clock, Package, User, Wrench } from "lucide-react";
import QuickAccessCard from "@/components/core/QuickAccessCard";
import { AlertTriangle, ClipboardList, DollarSign, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardCalendar from "@/components/core/DashboardCalendar";
import DashboardChart from "@/components/core/DashboardChart";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7x1 mx-auto px-6 py-6 space-y-8">
        {/*HEADER */}
        <header className="space-y-1">
          <h1 className="text-2x1 font-semibold tracking-tight">
            Panel de control
          </h1>
          <p className="text-sm text-muted-foreground">
            Estado general del sistema
          </p>
        </header>

        {/*KPis */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Indicadores</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Kpicard
              title="Repuestos sin stock"
              value={metrics.lowStock}
              icon={<AlertTriangle className="h-5 w-5" />}
              variant="danger"
            />

            <Kpicard
              title="Ordenes pendientes"
              value={metrics.pendingOrders}
              icon={<ClipboardList className="h-5 w-5" />}
              variant="warning"
            />

            <Kpicard
              title="Ventas hoy"
              value={metrics.todaySales}
              icon={<ShoppingCart className="h-5 w-5" />}
              variant="success"
            />

            <Kpicard
              title="Ingresos del mes"
              value={`$${metrics.monthlyRevenue.toLocaleString()}`}
              icon={<DollarSign className="h-5 w-5" />}
              variant="info"
            />
          </div>
        </section>

        {/* Accesos */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Accesos rapidos</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickAccessCard
              href="/inventory"
              title="Inventario"
              description="Gestión de repuestos y stock"
              icon={<Package className="h-5 w-5" />}
              variant="inventory"
            />

            <QuickAccessCard
              href="/workshop"
              title="Taller"
              description="Órdenes y operaciones"
              icon={<Wrench className="h-5 w-5" />}
              variant="workshop"
            />

            <QuickAccessCard
              href="/customers"
              title="Clientes"
              description="Gestión de clientes"
              icon={<User className="h-5 w-5" />}
              variant="customers"
            />

            <QuickAccessCard
              href="/reports"
              title="Reportes"
              description="Métricas y estadísticas"
              icon={<BarChart3 className="h-5 w-5" />}
              variant="reports"
            />

            <QuickAccessCard
              href="/calendar"
              title="Agenda"
              description="Eventos operativos"
              icon={<Calendar1 className="h-5 w-5" />}
              variant="calendar"
            />
            <QuickAccessCard
              href="/imports"
              title="importaciones"
              description="Seguimiento de importaciones"
              icon={<ChartColumn className="h-5 w-5" />}
              variant="imports"
            />
            <QuickAccessCard
              href="/alerts"
              title="Alertas"
              description="Stock critico y avisos"
              icon={<AlertTriangle className="h-5 w-5" />}
              variant="alerts"
            />
            <QuickAccessCard
              href="/history"
              title="Historial"
              description="Actividad reciente del sistema"
              icon={<Clock className="h-5 w-5" />}
              variant="history"
            />
          </div>
        </section>

        {/* Opreacion */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Actividad general</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {/* GRÁFICA */}
            <div className="lg:col-span-2">
              <Card className="rounded-2xl h-full">
                <CardHeader className="flex flex-row items-center gap-2">
                  <ChartColumn className="h-4 w-4 text-muted-foreground" />
                  <CardTitle>Actividad de importación</CardTitle>
                </CardHeader>

                <CardContent className="h-[260px]">
                  <DashboardChart />
                </CardContent>
              </Card>
            </div>

            {/* CALENDARIO */}
            <div className="h-full">
              <DashboardCalendar />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
