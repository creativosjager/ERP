import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

const json = (data: unknown, status = 200) => NextResponse.json(data, { status });

function cleanStr(v: unknown) {
  const s = String(v ?? "").trim();
  return s.length ? s : null;
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return json({ error: "JSON inválido" }, 400);

    const fullName = body.fullName !== undefined ? String(body.fullName).trim() : undefined;
    const phone = body.phone !== undefined ? String(body.phone).trim() : undefined;

    if (fullName !== undefined && !fullName) return json({ error: "fullName no puede ser vacío" }, 400);
    if (phone !== undefined && !phone) return json({ error: "phone no puede ser vacío" }, 400);

    const updated = await prisma.customer.update({
      where: { id: params.id },
      data: {
        fullName: fullName ?? undefined,
        phone: phone ?? undefined,
        email: body.email === undefined ? undefined : cleanStr(body.email),
        city: body.city === undefined ? undefined : cleanStr(body.city),
        address: body.address === undefined ? undefined : cleanStr(body.address),
        docId: body.docId === undefined ? undefined : cleanStr(body.docId),
        notes: body.notes === undefined ? undefined : cleanStr(body.notes),
      },
      select: {
        id: true,
        fullName: true,
        phone: true,
        email: true,
        city: true,
        address: true,
        docId: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return json(updated);
  } catch (e: any) {
    console.error("PUT /api/customers/[id] ERROR:", e);
    return json(
      {
        error: "Error actualizando cliente",
        detail: e?.message ?? String(e),
      },
      500
    );
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.customer.delete({ where: { id: params.id } });
    return json({ ok: true });
  } catch (e: any) {
    console.error("DELETE /api/customers/[id] ERROR:", e);
    return json(
      {
        error: "Error eliminando cliente",
        detail: e?.message ?? String(e),
      },
      500
    );
  }
}
