import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const parts = await prisma.part.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        sku: true,
        name: true,
        stock: true,
        priceCOP: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(parts);
  } catch (e: any) {
    return NextResponse.json(
      {
        error: "Error cargando inventario",
        detail: e?.message ?? String(e),
      },
      { status: 500 }
    );
  }
}
