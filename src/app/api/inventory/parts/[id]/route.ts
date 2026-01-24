import { prisma } from "@/lib/db/prisma";

export async function PUT(req: Request, ctx: { params: { id: string } }) {
  const { id } = ctx.params;
  const body = await req.json();

  const sku = String(body.sku || "").trim();
  const name = String(body.name || "").trim();
  const stock = Number(body.stock ?? 0);
  const minStock = Number(body.minStock ?? 0);
  const costCOP = body.costCOP === "" || body.costCOP == null ? null : Number(body.costCOP);
  const priceCOP = body.priceCOP === "" || body.priceCOP == null ? null : Number(body.priceCOP);

  if (!sku || !name) {
    return new Response(JSON.stringify({ error: "SKU y nombre son obligatorios." }), { status: 400 });
  }

  const updated = await prisma.part.update({
    where: { id },
    data: { sku, name, stock, minStock, costCOP, priceCOP },
  });

  return Response.json(updated);
}

export async function DELETE(_req: Request, ctx: { params: { id: string } }) {
  const { id } = ctx.params;

  await prisma.part.delete({ where: { id } });
  return new Response(null, { status: 204 });
}