import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET(req, { params }) {
  try {
    const db = await connectDB();
    const [rows] = await db.execute(
      "SELECT * FROM turnos WHERE id_turno = ?",
      [params.id]
    );

    return NextResponse.json(rows[0] || {});
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function PUT(req, context) {
  try {
    const params = await context.params;
    const { nombre_turno, hora_entrada, hora_salida } = await req.json();
    const db = await connectDB();

    await db.execute(
      `UPDATE turnos 
       SET nombre_turno=?, hora_entrada=?, hora_salida=?
       WHERE id_turno=?`,
      [nombre_turno, hora_entrada, hora_salida, params.id]
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  try {
    const params = await context.params;
    const db = await connectDB();

    await db.execute("DELETE FROM turnos WHERE id_turno = ?", [params.id]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
