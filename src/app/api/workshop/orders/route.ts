import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

const json = (data: unknown, status = 200) =>
  NextResponse.json(data, { status });

function pad6(n: number) {
  return String(n).padStart(6, "0");
}

async function nextCode() {
  // Busca el último OT-000001, OT-000002...
  const last = await prisma.workOrder.findFirst({
    orderBy: { createdAt: "desc" },
    select: { code: true },
  });

  const m = last?.code?.match(/^OT-(\d{6})$/);
  const lastNum = m ? Number(m[1]) : 0;
  return `OT-${pad6(lastNum + 1)}`;
}

export async function GET() {
  const items = await prisma.workOrder.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      customer: { select: { id: true, fullName: true, phone: true } },
      scooter: { select: { id: true, model: true, serial: true } },
    },
  });
  return json(items);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return json({ error: "JSON inválido" }, 400);

  const customerId = String(body.customerId ?? "").trim();
  const model = String(body.model ?? "").trim();
  const serial = String(body.serial ?? "").trim();
  const type = body.type === "GARANTIA" ? "GARANTIA" : "COBRO";
  const status = body.status || "RECIBIDA";

  if (!customerId) return json({ error: "customerId requerido" }, 400);
  if (!model) return json({ error: "Modelo requerido" }, 400);

  try {
    const code = await nextCode();

    // Creamos patineta (o vinculamos a una existente por serial si viene)
    let scooterId: string | null = null;

    if (serial) {
      const existing = await prisma.scooter.findUnique({
        where: { serial },
        select: { id: true },
      });

      if (existing) {
        scooterId = existing.id;
      } else {
        const createdScooter = await prisma.scooter.create({
          data: {
            model,
            serial,
            customerId,
          },
          select: { id: true },
        });
        scooterId = createdScooter.id;
      }
    } else {
      // sin serial: creamos scooter sin serial (permitido)
      const createdScooter = await prisma.scooter.create({
        data: {
          model,
          serial: null,
          customerId,
        },
        select: { id: true },
      });
      scooterId = createdScooter.id;
    }

    const created = await prisma.workOrder.create({
      data: {
        code,
        type,
        status,
        customerId,
        scooterId,
        issue: body.issue ? String(body.issue).trim() : null,
        notes: body.notes ? String(body.notes).trim() : null,
      },
      include: {
        customer: { select: { id: true, fullName: true, phone: true } },
        scooter: { select: { id: true, model: true, serial: true } },
      },
    });

    return json(created, 201);
  } catch (e: any) {
    return json({ error: "Error creando OT", detail: e?.message }, 500);
  }
}
