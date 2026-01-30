"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent as AlertDialogContentUI,
  AlertDialogDescription,
  AlertDialogFooter as AlertDialogFooterUI,
  AlertDialogHeader as AlertDialogHeaderUI,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MoreVertical, Trash2 } from "lucide-react";

type CustomerLite = { id: string; fullName: string; phone: string };
type ScooterLite = { id: string; model: string; serial: string | null };

type WorkOrder = {
  id: string;
  code: string;
  type: "GARANTIA" | "COBRO";
  status: "RECIBIDA" | "DIAGNOSTICO" | "EN_REPARACION" | "LISTA" | "ENTREGADA";
  issue: string | null;
  notes: string | null;
  createdAt: string;
  customer: CustomerLite;
  scooter: ScooterLite | null;
};

type Customer = {
  id: string;
  fullName: string;
  phone: string;
};

type CreateForm = {
  customerId: string;
  model: string;
  serial: string;
  type: "GARANTIA" | "COBRO";
  status: WorkOrder["status"];
  issue: string;
  notes: string;
};

const emptyCreate: CreateForm = {
  customerId: "",
  model: "",
  serial: "",
  type: "COBRO",
  status: "RECIBIDA",
  issue: "",
  notes: "",
};

function statusBadge(s: WorkOrder["status"]) {
  if (s === "ENTREGADA") return <Badge variant="secondary">Entregada</Badge>;
  if (s === "LISTA") return <Badge variant="secondary">Lista</Badge>;
  if (s === "EN_REPARACION") return <Badge variant="default">En reparación</Badge>;
  if (s === "DIAGNOSTICO") return <Badge variant="outline">Diagnóstico</Badge>;
  return <Badge variant="outline">Recibida</Badge>;
}

function typeBadge(t: WorkOrder["type"]) {
  return t === "GARANTIA" ? <Badge variant="secondary">Garantía</Badge> : <Badge variant="outline">Cobro</Badge>;
}

export default function WorkshopPage() {
  const [orders, setOrders] = useState<WorkOrder[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const [createOpen, setCreateOpen] = useState(false);
  const [createSaving, setCreateSaving] = useState(false);
  const [createForm, setCreateForm] = useState<CreateForm>(emptyCreate);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return orders;
    return orders.filter((o) => {
      const hay =
        o.code.toLowerCase().includes(s) ||
        o.customer.fullName.toLowerCase().includes(s) ||
        o.customer.phone.toLowerCase().includes(s) ||
        (o.scooter?.serial ?? "").toLowerCase().includes(s) ||
        (o.scooter?.model ?? "").toLowerCase().includes(s) ||
        (o.issue ?? "").toLowerCase().includes(s);
      return hay;
    });
  }, [orders, q]);

  async function load() {
    setLoading(true);
    try {
      // Customers
      const cRes = await fetch("/api/customers", { cache: "no-store" });
      const cText = await cRes.text();
      const cData = cText ? JSON.parse(cText) : [];
      setCustomers(Array.isArray(cData) ? cData : []);

      // Orders
      const oRes = await fetch("/api/workshop/orders", { cache: "no-store" });
      const oText = await oRes.text();
      const oData = oText ? JSON.parse(oText) : [];
      setOrders(Array.isArray(oData) ? oData : []);
    } catch (e) {
      console.error(e);
      alert("Error cargando taller");
      setCustomers([]);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function createOrder() {
    setCreateSaving(true);
    try {
      const res = await fetch("/api/workshop/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: createForm.customerId,
          model: createForm.model,
          serial: createForm.serial,
          type: createForm.type,
          status: createForm.status,
          issue: createForm.issue,
          notes: createForm.notes,
        }),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : null;

      if (!res.ok) {
        alert(data?.error || "No se pudo crear OT");
        return;
      }

      setCreateOpen(false);
      setCreateForm(emptyCreate);
      await load();
    } catch (e) {
      console.error(e);
      alert("Error creando OT");
    } finally {
      setCreateSaving(false);
    }
  }

  async function updateStatus(id: string, status: WorkOrder["status"]) {
    try {
      const res = await fetch(`/api/workshop/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const text = await res.text();
      const data = text ? JSON.parse(text) : null;

      if (!res.ok) {
        alert(data?.error || "No se pudo actualizar estado");
        return;
      }

      await load();
    } catch (e) {
      console.error(e);
      alert("Error actualizando estado");
    }
  }

  async function removeOrder(id: string) {
    try {
      const res = await fetch(`/api/workshop/orders/${id}`, { method: "DELETE" });
      const text = await res.text();
      const data = text ? JSON.parse(text) : null;

      if (!res.ok) {
        alert(data?.error || "No se pudo eliminar OT");
        return;
      }

      await load();
    } catch (e) {
      console.error(e);
      alert("Error eliminando OT");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Taller</h1>
          <p className="text-sm text-muted-foreground">
            Órdenes de taller (OT) con cliente, patineta, tipo y estado.
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por OT, cliente, teléfono, serial, modelo…"
            className="md:w-80"
          />

          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl">Nueva OT</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>Nueva Orden de Taller</DialogTitle>
                <DialogDescription>Registra la entrada de una patineta al taller.</DialogDescription>
              </DialogHeader>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Cliente</Label>
                  <select
                    className="h-10 w-full rounded-xl border bg-background px-3 text-sm"
                    value={createForm.customerId}
                    onChange={(e) => setCreateForm((f) => ({ ...f, customerId: e.target.value }))}
                  >
                    <option value="">Selecciona un cliente…</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.fullName} · {c.phone}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label>Modelo</Label>
                    <Input
                      value={createForm.model}
                      onChange={(e) => setCreateForm((f) => ({ ...f, model: e.target.value }))}
                      placeholder="Ej: JAGER ML2 PRO"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Serial (opcional)</Label>
                    <Input
                      value={createForm.serial}
                      onChange={(e) => setCreateForm((f) => ({ ...f, serial: e.target.value }))}
                      placeholder="Ej: SN-000123"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label>Tipo</Label>
                    <select
                      className="h-10 w-full rounded-xl border bg-background px-3 text-sm"
                      value={createForm.type}
                      onChange={(e) =>
                        setCreateForm((f) => ({ ...f, type: e.target.value as CreateForm["type"] }))
                      }
                    >
                      <option value="COBRO">Cobro</option>
                      <option value="GARANTIA">Garantía</option>
                    </select>
                  </div>

                  <div className="grid gap-2">
                    <Label>Estado</Label>
                    <select
                      className="h-10 w-full rounded-xl border bg-background px-3 text-sm"
                      value={createForm.status}
                      onChange={(e) =>
                        setCreateForm((f) => ({ ...f, status: e.target.value as WorkOrder["status"] }))
                      }
                    >
                      <option value="RECIBIDA">Recibida</option>
                      <option value="DIAGNOSTICO">Diagnóstico</option>
                      <option value="EN_REPARACION">En reparación</option>
                      <option value="LISTA">Lista</option>
                      <option value="ENTREGADA">Entregada</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Falla / Motivo (opcional)</Label>
                  <Input
                    value={createForm.issue}
                    onChange={(e) => setCreateForm((f) => ({ ...f, issue: e.target.value }))}
                    placeholder="Ej: no acelera / ruido rueda / freno flojo…"
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Observaciones (opcional)</Label>
                  <Input
                    value={createForm.notes}
                    onChange={(e) => setCreateForm((f) => ({ ...f, notes: e.target.value }))}
                    placeholder="Ej: incluye cargador / golpe lateral / etc."
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="ghost" onClick={() => setCreateOpen(false)} className="rounded-xl">
                  Cancelar
                </Button>
                <Button
                  onClick={createOrder}
                  disabled={createSaving || !createForm.customerId || !createForm.model.trim()}
                  className="rounded-xl"
                >
                  {createSaving ? "Guardando…" : "Crear OT"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">Órdenes</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="text-sm text-muted-foreground">Cargando taller…</div>
          ) : filtered.length === 0 ? (
            <div className="text-sm text-muted-foreground">No hay órdenes aún.</div>
          ) : (
            <div className="overflow-hidden rounded-xl border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>OT</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Patineta</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Motivo</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filtered.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell className="font-mono text-xs">{o.code}</TableCell>
                      <TableCell>
                        <div className="font-medium">{o.customer.fullName}</div>
                        <div className="text-xs text-muted-foreground">{o.customer.phone}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{o.scooter?.model ?? "—"}</div>
                        <div className="text-xs text-muted-foreground">{o.scooter?.serial ?? "—"}</div>
                      </TableCell>
                      <TableCell>{typeBadge(o.type)}</TableCell>
                      <TableCell>{statusBadge(o.status)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{o.issue ?? "—"}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-xl" aria-label="Acciones">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => updateStatus(o.id, "RECIBIDA")}>
                              Estado: Recibida
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateStatus(o.id, "DIAGNOSTICO")}>
                              Estado: Diagnóstico
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateStatus(o.id, "EN_REPARACION")}>
                              Estado: En reparación
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateStatus(o.id, "LISTA")}>
                              Estado: Lista
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateStatus(o.id, "ENTREGADA")}>
                              Estado: Entregada
                            </DropdownMenuItem>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Eliminar
                                </DropdownMenuItem>
                              </AlertDialogTrigger>

                              <AlertDialogContentUI>
                                <AlertDialogHeaderUI>
                                  <AlertDialogTitle>Eliminar OT</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esto elimina la orden <span className="font-medium">{o.code}</span>. No se puede deshacer.
                                  </AlertDialogDescription>
                                </AlertDialogHeaderUI>

                                <AlertDialogFooterUI>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => removeOrder(o.id)}>
                                    Eliminar
                                  </AlertDialogAction>
                                </AlertDialogFooterUI>
                              </AlertDialogContentUI>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
