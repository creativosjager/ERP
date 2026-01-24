"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ImportInventoryDialog from "@/components/core/import-inventory-dialog";

type Part = {
  id: string;
  sku: string;
  name: string;
  stock: number;
  priceCOP: number | null;
};

async function safeJson(res: Response) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { __raw: text };
  }
}

export default function InventoryPage() {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);

    const res = await fetch("/api/inventory/parts", { cache: "no-store" });
    const data = await safeJson(res);

    if (!res.ok) {
      setParts([]);
      setError((data && (data.error || data.message)) || `Error HTTP ${res.status}`);
      setLoading(false);
      return;
    }

    if (!data || !Array.isArray(data)) {
      setParts([]);
      setError("La API no devolvio un array JSON. Revisa /api/inventory/parts");
      setLoading(false);
      return;
    }

    setParts(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return parts;
    return parts.filter(
      (p) => p.sku.toLowerCase().includes(s) || p.name.toLowerCase().includes(s)
    );
  }, [parts, q]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Inventario</h1>
          <p className="text-sm text-muted-foreground">
            Repuestos y control de stock
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por SKU o nombre"
            className="md:w-72"
          />

          {/* ESTE es el boton real */}
          <ImportInventoryDialog onDone={load} />
        </div>
      </div>

      {error && (
        <Card className="rounded-2xl">
          <CardContent className="py-3 text-sm">
            <div className="font-medium">No se pudo cargar</div>
            <div className="text-muted-foreground">{error}</div>
            <div className="text-xs text-muted-foreground mt-2">
              Tip: abre /api/inventory/parts en el navegador para ver la respuesta.
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">Repuestos</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-sm text-muted-foreground">Cargando inventario...</div>
          ) : filtered.length === 0 ? (
            <div className="text-sm text-muted-foreground">No hay repuestos.</div>
          ) : (
            <div className="overflow-hidden rounded-xl border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="text-left py-2 px-3">SKU</th>
                    <th className="text-left py-2 px-3">Nombre</th>
                    <th className="text-right py-2 px-3">Stock</th>
                    <th className="text-right py-2 px-3">Precio</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id} className="border-b">
                      <td className="py-2 px-3 font-mono text-xs">{p.sku}</td>
                      <td className="py-2 px-3">{p.name}</td>
                      <td className="py-2 px-3 text-right">{p.stock}</td>
                      <td className="py-2 px-3 text-right">
                        {p.priceCOP != null ? p.priceCOP.toLocaleString("es-CO") : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
