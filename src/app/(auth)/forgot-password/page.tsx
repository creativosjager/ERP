import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function forgotPasswordPage() {
    return (
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2x1 font-bold">
            Recuperar Contraseña
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Te enviaremos un enlace al correo
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Correo</label>
            <Input type="email" placeholder="correo@empresa.com" />
          </div>

          <Button className=" cursor-pointer w-full rounded-lg bg-black py-2 text-white hover:bg-gray-800">
            Enviar enlace
          </Button>

          <div className="text-center text-sm">
            <Link href="/login" className="text-primary hover:underline">
              Volver a la pagina
            </Link>
          </div>
        </CardContent>
      </Card>
    );
}