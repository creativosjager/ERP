"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { mockUsers } from "@/lib/mockUsers";
const ADMIN_EMAIL = "practicantejager@gmail.com"; "Juampa@gmail.com";
const ADMIN_PASSWORD = "Jager.123";


export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  
  const handleLogin = () => {
    setError("");

    if (!email || !password) {
      setError("Completa todos los campos");
      return;
    }

    setLoading(true);

    //  Simulación bd
    setTimeout(() => {
      const user = mockUsers.find(
        (u) => u.email === email && u.password === password
      );
      if (!user) {
        setError("informacion incorrecta");
        setLoading(false);
        return;
      }
      if (user.role === "admin") {
        router.push("/");
      }
      if (user.role === "reports") {
        router.push("/reports");
      }
      if (user.role === "sales") {
        router.push("/inventory");
      }
      if (user.role === "workshop") {
        router.push("/workshop");
      }

      setLoading(false);
    }
  ,800);
};

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Iniciar sesión</CardTitle>
        <p className="text-sm text-muted-foreground">Accede al sistema JAGER</p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Correo</label>
          <Input
            type="email"
            placeholder="correo@empresa.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Contraseña</label>
          <Input
            type="password"
            placeholder="*****"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <Button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full rounded-lg py-2 text-white transition
              ${
                loading
                  ? "bg-gray-400 cursor-wait"
                  : "bg-black hover:bg-gray-800 cursor-pointer"
              }
            `}
        >
          {loading ? "Validando..." : "Entrar"}
        </Button>

        <div className="text-center text-sm">
          <Link
            href="/forgot-password"
            className="text-primary hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
