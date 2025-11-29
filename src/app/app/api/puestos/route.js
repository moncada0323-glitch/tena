import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET(req) {
  try {
    const db = await connectDB();
    const [rows] = await db.execute(`
      SELECT id_puesto, nombre_puesto 
      FROM puestos ORDER BY nombre_puesto ASC
    `);

    return NextResponse.json(rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { nombre_puesto } = await req.json();
    const db = await connectDB();

    await db.execute(
      "INSERT INTO puestos (nombre_puesto) VALUES (?)",
      [nombre_puesto]
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
