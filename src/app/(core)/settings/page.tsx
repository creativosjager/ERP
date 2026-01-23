import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Configuracion</h1>
        <p className="text-sm text-muted-foreground">
          Usuarios, roles y parametros de la intranet.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Usuarios y roles</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>- Admin: control total</p>
            <p>- Taller: OT e inventario basico</p>
            <p>- Reportes: solo lectura</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Integraciones futuras</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>- Siigo (facturacion / productos)</p>
            <p>- WordPress (catalogo / stock)</p>
            <p>- Google Sheets (sincronizacion)</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
