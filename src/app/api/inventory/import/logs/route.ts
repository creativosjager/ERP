import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const logs = await prisma.inventoryImportLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return Response.json(logs);
}