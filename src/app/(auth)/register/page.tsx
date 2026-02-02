"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
export default function RegisterPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    
     const handleRegister = () => {
    setError("");

    if (!email || !password || !confirmPassword) {
      setError("Completa todos los campos");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    
    setTimeout(() => {
      setLoading(false);
      alert("Registro simulado");
    }, 1000);
    };
    
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
                    <h1 className="mb-6 text-center text-2xl font-bold">Crear cuenta</h1>

                    <form className="space-y-4">
                        <input
                            type="text"
                            placeholder="Nombre completo"
                            className="w-full rounded-lg border px-4 py-2"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <Input
                            type="email"
                            placeholder="Correo electrónico"
                            className="w-full rounded-lg border px-4 py-2"
                        />
                        {error && <p className="text-sm text-red-500">{error}</p>}

                        <Input
                            type="password"
                            placeholder="Contraseña"
                            className="w-full rounded-lg border px-4 py-2"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {error && <p className="text-sm text-red-500">{error}</p>}

                        <Button
                            onClick={handleRegister}
                            disabled={loading}
                            className={`w-full ${loading
                                    ? "cursor-wait bg-gray-400"
                                    : "cursor-pointer bg-black hover:bg-gray-800"
                                }`}
                        >
                            {loading ? "Registrando..." : "Registrarse"}
                        </Button>
                    </form>

                    <p className="mt-4 text-center text-sm">
                        ¿Ya tienes cuenta?{" "}
                        <Link href="/login" className="font-semibold underline">
                            Inicia sesión
                        </Link>
                    </p>
                </div>
            </div>
        );
    }
