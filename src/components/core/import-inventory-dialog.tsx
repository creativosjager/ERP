"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ImportInventoryDialog({
  onDone,
}: {
  onDone: () => Promise<void> | void;
}) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  // defaults segun tu sheet
  const [sheetName, setSheetName] = useState("REPUESTOS_MAESTRO");
  const [colSku, setColSku] = useState("A");
  const [colName, setColName] = useState("B");
  const [colCategory, setColCategory] = useState("E");
  const [colPrice, setColPrice] = useState("I");
  const [colStock, setColStock] = useState("");
  const [colMinStock, setColMinStock] = useState("");

  async function upload() {
    if (!file) return;

    setLoading(true);
    setResult(null);

    const fd = new FormData();
    fd.append("file", file);
    fd.append("sheetName", sheetName);
    fd.append("colSku", colSku);
    fd.append("colName", colName);
    fd.append("colCategory", colCategory);
    fd.append("colPrice", colPrice);
    fd.append("colStock", colStock);
    fd.append("colMinStock", colMinStock);

    const res = await fetch("/api/inventory/import", {
      method: "POST",
      body: fd,
    });

    const data = await res
      .json()
      .catch(() => ({ error: "Respuesta invalida del servidor" }));

    setLoading(false);

    if (!res.ok) {
      alert(data.error || "Error al importar");
      return;
    }

    setResult(data);
    await onDone();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="rounded-xl">
          Importar archivo
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Importar inventario</DialogTitle>
          <DialogDescription>
            Sube un Excel (.xlsx) y sincroniza los repuestos con JAGER CORE.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Archivo</Label>
            <Input
              type="file"
              accept=".xlsx,.csv"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Pestana</Label>
              <Input value={sheetName} onChange={(e) => setSheetName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>SKU (col)</Label>
              <Input value={colSku} onChange={(e) => setColSku(e.target.value.toUpperCase())} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Nombre (col)</Label>
              <Input value={colName} onChange={(e) => setColName(e.target.value.toUpperCase())} />
            </div>
            <div className="grid gap-2">
              <Label>Categoria (col)</Label>
              <Input
                value={colCategory}
                onChange={(e) => setColCategory(e.target.value.toUpperCase())}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Precio (col)</Label>
              <Input value={colPrice} onChange={(e) => setColPrice(e.target.value.toUpperCase())} />
            </div>
            <div className="grid gap-2">
              <Label>Stock (col)</Label>
              <Input
                value={colStock}
                onChange={(e) => setColStock(e.target.value.toUpperCase())}
                placeholder="Opcional"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Stock minimo (col)</Label>
            <Input
              value={colMinStock}
              onChange={(e) => setColMinStock(e.target.value.toUpperCase())}
              placeholder="Opcional"
            />
          </div>

          {result && (
            <div className="rounded-xl border p-3 text-sm">
              <div className="font-medium">Resultado</div>
              <div className="text-muted-foreground">
                Procesadas: {result.processed ?? "-"} · Saltadas: {result.skipped ?? "-"} · Errores:{" "}
                {result.errors?.length || 0}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            className="rounded-xl"
            onClick={() => setOpen(false)}
          >
            Cerrar
          </Button>
          <Button className="rounded-xl" onClick={upload} disabled={!file || loading}>
            {loading ? "Importando..." : "Importar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
