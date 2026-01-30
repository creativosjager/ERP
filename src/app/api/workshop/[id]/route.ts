import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

const json = (data: unknown, status = 200) =>
  NextResponse.json(data, { status });

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json().catch(() => null);
  if (!body) return json({ error: "JSON inválido" }, 400);

  try {
    const updated = await prisma.workOrder.update({
      where: { id: params.id },
      data: {
        status: body.status ?? undefined,
        type: body.type ?? undefined,
        issue: body.issue === "" ? null : body.issue ? String(body.issue) : undefined,
        diagnosis: body.diagnosis === "" ? null : body.diagnosis ? String(body.diagnosis) : undefined,
        notes: body.notes === "" ? null : body.notes ? String(body.notes) : undefined,
        laborCOP: body.laborCOP ?? undefined,
        totalCOP: body.totalCOP ?? undefined,
      },
      include: {
        customer: { select: { id: true, fullName: true, phone: true } },
        scooter: { select: { id: true, model: true, serial: true } },
      },
    });

    return json(updated);
  } catch (e: any) {
    return json({ error: "Error actualizando OT", detail: e?.message }, 500);
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.workOrder.delete({ where: { id: params.id } });
    return json({ ok: true });
  } catch (e: any) {
    return json({ error: "Error eliminando OT", detail: e?.message }, 500);
  }
}
