import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

function toInt(v: any, def = 0) {
  const n = Number(v);
  if (!Number.isFinite(n)) return def;
  return Math.trunc(n);
}

function toMoneyOrNull(v: any) {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(String(v).replace(/\./g, "").replace(/,/g, "."));
  return Number.isFinite(n) ? n : null;
}

export async function GET() {
  try {
    const parts = await prisma.part.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        sku: true,
        name: true,
        stock: true,
        minStock: true,
        costCOP: true,
        priceCOP: true,
        updatedAt: true,
      },
    });

    return json(parts);
  } catch (e: any) {
    return json(
      { error: "Error cargando inventario", detail: e?.message ?? String(e) },
      500
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    if (!body) return json({ error: "Body JSON inválido" }, 400);

    const sku = String(body.sku ?? "").trim();
    const name = String(body.name ?? "").trim();

    if (!sku || !name) {
      return json({ error: "SKU y nombre son requeridos" }, 400);
    }

    const stock = toInt(body.stock, 0);
    const minStock = toInt(body.minStock, 0);
    const costCOP = toMoneyOrNull(body.costCOP);
    const priceCOP = toMoneyOrNull(body.priceCOP);

    const created = await prisma.part.create({
      data: { sku, name, stock, minStock, costCOP, priceCOP },
      select: {
        id: true,
        sku: true,
        name: true,
        stock: true,
        minStock: true,
        costCOP: true,
        priceCOP: true,
        updatedAt: true,
      },
    });

    return json(created, 201);
  } catch (e: any) {
    // Si sku es unique, Prisma lanza P2002 cuando se repite
    if (String(e?.code) === "P2002") {
      return json({ error: "SKU ya existe" }, 409);
    }

    return json(
      { error: "Error creando repuesto", detail: e?.message ?? String(e) },
      500
    );
  }
}
