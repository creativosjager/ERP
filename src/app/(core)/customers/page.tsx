"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

type Customer = {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  city: string | null;
  address: string | null;
  docId: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

type FormState = {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  address: string;
  docId: string;
  notes: string;
};

const emptyForm: FormState = {
  fullName: "",
  phone: "",
  email: "",
  city: "",
  address: "",
  docId: "",
  notes: "",
};

function safeLower(v: any) {
  return String(v ?? "").toLowerCase();
}

function toPayload(f: FormState) {
  return {
    fullName: f.fullName.trim(),
    phone: f.phone.trim(),
    email: f.email.trim() || null,
    city: f.city.trim() || null,
    address: f.address.trim() || null,
    docId: f.docId.trim() || null,
    notes: f.notes.trim() || null,
  };
}

export default function CustomersPage() {
  const [items, setItems] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  // Create
  const [createOpen, setCreateOpen] = useState(false);
  const [createSaving, setCreateSaving] = useState(false);
  const [createForm, setCreateForm] = useState<FormState>(emptyForm);

  // Edit
  const [editOpen, setEditOpen] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [editForm, setEditForm] = useState<FormState>(emptyForm);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((c) => {
      return (
        safeLower(c.fullName).includes(s) ||
        safeLower(c.phone).includes(s) ||
        safeLower(c.email).includes(s) ||
        safeLower(c.docId).includes(s) ||
        safeLower(c.city).includes(s)
      );
    });
  }, [items, q]);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/customers", { cache: "no-store" });
      const text = await res.text();

      const trimmed = text.trim();
      const isHtml =
        trimmed.startsWith("<!DOCTYPE") ||
        trimmed.startsWith("<html") ||
        trimmed.startsWith("<body");

      if (!res.ok) {
        console.error(
          "Customers API error:",
          res.status,
          res.statusText,
          isHtml ? "HTML (probable login/middleware)" : trimmed.slice(0, 300)
        );

        // Si es auth, no spameamos
        if (res.status === 401 || res.status === 403) {
          setItems([]);
          return;
        }

        let msg = "No se pudieron cargar clientes";
        if (!isHtml && trimmed) {
          try {
            const data = JSON.parse(trimmed);
            msg = data?.error || msg;
          } catch {}
        }

        alert(msg);
        setItems([]);
        return;
      }

      // 200 pero HTML: raro, pero lo manejamos
      if (isHtml) {
        console.warn(
          "Customers API devolvió HTML con 200. Revisa middleware/auth."
        );
        setItems([]);
        return;
      }

      const data = trimmed ? JSON.parse(trimmed) : [];
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      alert("Error cargando clientes");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function createCustomer() {
    setCreateSaving(true);
    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toPayload(createForm)),
      });

      const text = await res.text();
      const trimmed = text.trim();
      const data = trimmed ? JSON.parse(trimmed) : null;

      if (!res.ok) {
        alert(data?.error || "Error al crear cliente");
        return;
      }

      setCreateOpen(false);
      setCreateForm(emptyForm);
      await load();
    } catch (e) {
      console.error(e);
      alert("Error al crear cliente");
    } finally {
      setCreateSaving(false);
    }
  }

  function openEdit(c: Customer) {
    setEditing(c);
    setEditForm({
      fullName: c.fullName ?? "",
      phone: c.phone ?? "",
      email: c.email ?? "",
      city: c.city ?? "",
      address: c.address ?? "",
      docId: c.docId ?? "",
      notes: c.notes ?? "",
    });
    setEditOpen(true);
  }

  async function saveEdit() {
    if (!editing) return;

    setEditSaving(true);
    try {
      const res = await fetch(`/api/customers/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toPayload(editForm)),
      });

      const text = await res.text();
      const trimmed = text.trim();
      const data = trimmed ? JSON.parse(trimmed) : null;

      if (!res.ok) {
        alert(data?.error || "Error al actualizar cliente");
        return;
      }

      setEditOpen(false);
      setEditing(null);
      await load();
    } catch (e) {
      console.error(e);
      alert("Error al actualizar cliente");
    } finally {
      setEditSaving(false);
    }
  }

  async function removeCustomer(id: string) {
    try {
      const res = await fetch(`/api/customers/${id}`, { method: "DELETE" });
      const text = await res.text();
      const trimmed = text.trim();
      const data = trimmed ? JSON.parse(trimmed) : null;

      if (!res.ok) {
        alert(data?.error || "No se pudo eliminar el cliente");
        return;
      }

      await load();
    } catch (e) {
      console.error(e);
      alert("Error eliminando cliente");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Clientes</h1>
          <p className="text-sm text-muted-foreground">
            Ficha única del cliente y datos de contacto para taller, facturación
            y devoluciones.
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nombre, teléfono, email, documento o ciudad…"
            className="md:w-80"
          />

          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl">Nuevo cliente</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>Nuevo cliente</DialogTitle>
                <DialogDescription>
                  Registra un cliente para asociarlo a patinetas, OT y RMA.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Nombre completo</Label>
                  <Input
                    value={createForm.fullName}
                    onChange={(e) =>
                      setCreateForm((f) => ({ ...f, fullName: e.target.value }))
                    }
                    placeholder="Ej: Juan Pérez"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label>Teléfono</Label>
                    <Input
                      value={createForm.phone}
                      onChange={(e) =>
                        setCreateForm((f) => ({ ...f, phone: e.target.value }))
                      }
                      placeholder="Ej: 3001234567"
                      inputMode="tel"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Email (opcional)</Label>
                    <Input
                      value={createForm.email}
                      onChange={(e) =>
                        setCreateForm((f) => ({ ...f, email: e.target.value }))
                      }
                      placeholder="Ej: cliente@mail.com"
                      inputMode="email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label>Ciudad (opcional)</Label>
                    <Input
                      value={createForm.city}
                      onChange={(e) =>
                        setCreateForm((f) => ({ ...f, city: e.target.value }))
                      }
                      placeholder="Bogotá"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Documento/NIT (opcional)</Label>
                    <Input
                      value={createForm.docId}
                      onChange={(e) =>
                        setCreateForm((f) => ({ ...f, docId: e.target.value }))
                      }
                      placeholder="CC / NIT"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Dirección (opcional)</Label>
                  <Input
                    value={createForm.address}
                    onChange={(e) =>
                      setCreateForm((f) => ({ ...f, address: e.target.value }))
                    }
                    placeholder="Dirección"
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Notas internas (opcional)</Label>
                  <Input
                    value={createForm.notes}
                    onChange={(e) =>
                      setCreateForm((f) => ({ ...f, notes: e.target.value }))
                    }
                    placeholder="Ej: cliente frecuente / garantía pendiente / etc."
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="ghost"
                  onClick={() => setCreateOpen(false)}
                  className="rounded-xl"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={createCustomer}
                  disabled={createSaving}
                  className="rounded-xl"
                >
                  {createSaving ? "Guardando…" : "Guardar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">Listado</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="text-sm text-muted-foreground">
              Cargando clientes…
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No hay clientes aún.
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Ciudad</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filtered.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">
                        {c.fullName}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {c.phone}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {c.email ?? "—"}
                      </TableCell>
                      <TableCell>{c.city ?? "—"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {c.docId ?? "—"}
                      </TableCell>

                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-xl"
                              aria-label="Acciones"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEdit(c)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Eliminar
                                </DropdownMenuItem>
                              </AlertDialogTrigger>

                              <AlertDialogContentUI>
                                <AlertDialogHeaderUI>
                                  <AlertDialogTitle>
                                    Eliminar cliente
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esto elimina el cliente{" "}
                                    <span className="font-medium">
                                      {c.fullName}
                                    </span>
                                    . Esta acción no se puede deshacer.
                                  </AlertDialogDescription>
                                </AlertDialogHeaderUI>

                                <AlertDialogFooterUI>
                                  <AlertDialogCancel>
                                    Cancelar
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => removeCustomer(c.id)}
                                  >
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

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Editar cliente</DialogTitle>
            <DialogDescription>Actualiza datos del cliente.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Nombre completo</Label>
              <Input
                value={editForm.fullName}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, fullName: e.target.value }))
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Teléfono</Label>
                <Input
                  value={editForm.phone}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, phone: e.target.value }))
                  }
                  inputMode="tel"
                />
              </div>
              <div className="grid gap-2">
                <Label>Email (opcional)</Label>
                <Input
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, email: e.target.value }))
                  }
                  inputMode="email"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Ciudad (opcional)</Label>
                <Input
                  value={editForm.city}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, city: e.target.value }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Documento/NIT (opcional)</Label>
                <Input
                  value={editForm.docId}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, docId: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Dirección (opcional)</Label>
              <Input
                value={editForm.address}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, address: e.target.value }))
                }
              />
            </div>

            <div className="grid gap-2">
              <Label>Notas internas (opcional)</Label>
              <Input
                value={editForm.notes}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, notes: e.target.value }))
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setEditOpen(false)}
              className="rounded-xl"
            >
              Cancelar
            </Button>
            <Button
              onClick={saveEdit}
              disabled={editSaving}
              className="rounded-xl"
            >
              {editSaving ? "Guardando…" : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}