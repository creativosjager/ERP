import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Clientes</h1>
        <p className="text-sm text-muted-foreground">
          Registro basico de duenos y relacion con ordenes de taller.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Clientes</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">0</CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Con OT</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">0</CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Ultimos 30 dias</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">0</CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">Campos sugeridos</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>- Nombre completo</p>
          <p>- Telefono</p>
          <p>- Ciudad</p>
          <p>- Notas (observaciones)</p>
        </CardContent>
      </Card>
    </div>
  );
}
