import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Reportes</h1>
        <p className="text-sm text-muted-foreground">
          Vista de indicadores y exportables (modo lectura).
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Movimientos hoy</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">0</CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">OT del mes</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">0</CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Repuestos sin stock</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">0</CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">Proximo desarrollo</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>- Reporte de inventario: sin stock, bajo stock, valorizacion.</p>
          <p>- Reporte de taller: OT por estado, tiempos, repetidos.</p>
          <p>- Exportar a CSV/Excel.</p>
        </CardContent>
      </Card>
    </div>
  );
}
