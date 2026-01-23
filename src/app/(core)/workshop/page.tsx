import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function WorkshopPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Taller (OT)</h1>
        <p className="text-sm text-muted-foreground">
          Entradas al taller, estado y observaciones.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">OT abiertas</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">0</CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">En diagnostico</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">0</CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Listas para entrega</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">0</CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">Proximo desarrollo</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>- Crear OT: dueno, telefono, modelo, serial, estado, observaciones.</p>
          <p>- Estados sugeridos: Recibida, Diagnostico, En reparacion, Lista, Entregada.</p>
          <p>- Historial: quien cambio que y cuando.</p>
        </CardContent>
      </Card>
    </div>
  );
}
