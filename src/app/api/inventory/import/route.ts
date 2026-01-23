import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { prisma } from "@/lib/db/prisma";

function normalizeCol(input: string) {
  const c = String(input || "").trim().toUpperCase();
  return /^[A-Z]{1,3}$/.test(c) ? c : "";
}

function colToIndex(col: string) {
  // A -> 0, B -> 1 ... Z -> 25, AA -> 26 ...
  let n = 0;
  for (let i = 0; i < col.length; i++) {
    n = n * 26 + (col.charCodeAt(i) - 64);
  }
  return n - 1;
}

function moneyToNumber(v: any) {
  const s = String(v ?? "").trim();
  if (!s) return null;
  // limpia separadores tipicos (1.234.567) y soporta coma decimal
  const cleaned = s.replace(/\s/g, "").replace(/\./g, "").replace(/,/g, ".");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function toInt(v: any) {
  const s = String(v ?? "").trim();
  if (!s) return null;
  const n = Number(s.replace(/\./g, "").replace(/,/g, "."));
  if (!Number.isFinite(n)) return null;
  return Math.trunc(n);
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "Archivo no recibido" }, { status: 400 });
    }

    const sheetName = String(formData.get("sheetName") || "").trim();
    const colSku = normalizeCol(String(formData.get("colSku") || "A"));
    const colName = normalizeCol(String(formData.get("colName") || "B"));
    const colCategory = normalizeCol(String(formData.get("colCategory") || ""));
    const colPrice = normalizeCol(String(formData.get("colPrice") || ""));
    const colStock = normalizeCol(String(formData.get("colStock") || ""));
    const colMinStock = normalizeCol(String(formData.get("colMinStock") || ""));

    if (!colSku || !colName) {
      return NextResponse.json(
        { error: "Columnas invalidas. SKU y Nombre son requeridas (A, B, C...)" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = XLSX.read(buffer, { type: "buffer" });

    const targetSheet =
      sheetName && workbook.SheetNames.includes(sheetName)
        ? sheetName
        : workbook.SheetNames[0];

    const sheet = workbook.Sheets[targetSheet];
    if (!sheet) {
      return NextResponse.json({ error: "No se encontro la pestaña indicada" }, { status: 400 });
    }

    // array de arrays (rows), primera fila es encabezado usualmente
    const aoa: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });

    if (!aoa.length) {
      return NextResponse.json({ error: "La pestaña viene vacia" }, { status: 400 });
    }

    const iSku = colToIndex(colSku);
    const iName = colToIndex(colName);
    const iCategory = colCategory ? colToIndex(colCategory) : -1;
    const iPrice = colPrice ? colToIndex(colPrice) : -1;
    const iStock = colStock ? colToIndex(colStock) : -1;
    const iMin = colMinStock ? colToIndex(colMinStock) : -1;

    const errors: Array<{ row: number; reason: string }> = [];
    let created = 0;
    let updated = 0;
    let skipped = 0;

    // asumimos encabezado en fila 1 -> empezamos en index 1
    for (let r = 1; r < aoa.length; r++) {
      const row = aoa[r] || [];

      const sku = String(row[iSku] ?? "").trim();
      const name = String(row[iName] ?? "").trim();

      if (!sku || !name) {
        skipped++;
        continue;
      }

      // opcionales
      const category = iCategory >= 0 ? String(row[iCategory] ?? "").trim() : "";
      const priceCOP = iPrice >= 0 ? moneyToNumber(row[iPrice]) : null;
      const stock = iStock >= 0 ? (toInt(row[iStock]) ?? 0) : 0;
      const minStock = iMin >= 0 ? (toInt(row[iMin]) ?? 0) : 0;

      try {
        // IMPORTANTE: sku debe ser UNIQUE en Prisma para upsert por sku
        await prisma.part.upsert({
          where: { sku },
          create: {
            sku,
            name,
            stock,
            minStock,
            priceCOP,
            // si tu modelo no tiene category, borra esta linea:
            category: category || null,
          } as any,
          update: {
            name,
            stock,
            minStock,
            priceCOP,
            category: category || null,
          } as any,
        });

        // No sabemos si fue create o update sin consulta extra.
        // Optimizacion: consultamos existencia rapida con updateMany? no.
        // Aqui hacemos conteo aproximado con una consulta previa? no vale el costo.
        // Entonces: marcamos como updated si ya existia, con findUnique simple.
        // (Costo: 1 query extra por fila; si es grande puede ser pesado. Mejor: conteo simple.)
        updated++;
      } catch (e: any) {
        errors.push({ row: r + 1, reason: e?.message ?? "Error" });
      }
    }

    // Ajuste: como arriba sumamos todo en updated, devolvemos created/updated reales por estrategia simple:
    // Para no matar la DB con 600 queries extras, dejamos created=0 y updated=procesadas.
    // Si quieres conteo real, lo hacemos luego con un enfoque batch.
    const processed = aoa.length - 1 - skipped;
    return NextResponse.json({
      ok: true,
      sheet: targetSheet,
      rows: aoa.length - 1,
      processed,
      created,
      updated,
      skipped,
      errors,
      note: "Conteo created/updated es basico por performance (se optimiza despues).",
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Error procesando archivo", detail: e?.message ?? String(e) },
      { status: 500 }
    );
  }
}
