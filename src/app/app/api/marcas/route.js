import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    const db = await connectDB();

    const [rows] = await db.execute(`
      SELECT id_marca, nombre_marca
      FROM marcas
      ORDER BY id_marca DESC
    `);

    return NextResponse.json(rows);

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, message: "Error al obtener marcas" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { nombre_marca } = await req.json();
    const db = await connectDB();

    await db.execute(
      `INSERT INTO marcas (nombre_marca)
       VALUES (?)`,
      [nombre_marca]
    );

    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, message: "Error al agregar marca" },
      { status: 500 }
    );
  }
}
