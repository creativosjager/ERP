export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const rows = await prisma.customer.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(rows);
  } catch (e: any) {
    return NextResponse.json(
      { error: "Error cargando clientes", detail: e?.message || String(e) },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const fullName = String(body.fullName ?? "").trim();
    const phone = String(body.phone ?? "").trim();

    if (!fullName || !phone) {
      return NextResponse.json(
        { error: "fullName y phone son obligatorios" },
        { status: 400 }
      );
    }

    const created = await prisma.customer.create({
      data: {
        fullName,
        phone,
        email: body.email ?? null,
        city: body.city ?? null,
        address: body.address ?? null,
        docId: body.docId ?? null,
        notes: body.notes ?? null,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Error creando cliente", detail: e?.message || String(e) },
      { status: 500 }
    );
  }
}
