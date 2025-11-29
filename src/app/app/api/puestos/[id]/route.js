import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET(req, { params }) {
  try {
    const db = await connectDB();
    const [rows] = await db.execute(
      "SELECT id_puesto, nombre_puesto FROM puestos WHERE id_puesto = ?",
      [params.id]
    );

    return NextResponse.json(rows[0] || {});
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { nombre_puesto } = await req.json();
    const db = await connectDB();

    await db.execute(
      "UPDATE puestos SET nombre_puesto = ? WHERE id_puesto = ?",
      [nombre_puesto, params.id]
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const db = await connectDB();

    await db.execute("DELETE FROM puestos WHERE id_puesto = ?", [params.id]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
