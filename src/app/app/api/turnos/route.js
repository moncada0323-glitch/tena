import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    const db = await connectDB();
    const [rows] = await db.execute(`
      SELECT id_turno, nombre_turno, hora_entrada, hora_salida 
      FROM turnos ORDER BY nombre_turno ASC
    `);

    return NextResponse.json(rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { nombre_turno, hora_entrada, hora_salida } = await req.json();
    const db = await connectDB();

    await db.execute(
      "INSERT INTO turnos (nombre_turno, hora_entrada, hora_salida) VALUES (?, ?, ?)",
      [nombre_turno, hora_entrada, hora_salida]
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
