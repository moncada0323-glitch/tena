import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    const db = await connectDB();

    const [rows] = await db.execute(`
      SELECT id_proovedor, nombre_proovedor, compania, telefono, correo
      FROM proovedor
      ORDER BY id_proovedor DESC
    `);

    return NextResponse.json(rows);

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, message: "Error al obtener proveedores" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { nombre_proovedor, compania, telefono, correo } = await req.json();
    const db = await connectDB();

    await db.execute(
      `INSERT INTO proovedor (nombre_proovedor, compania, telefono, correo)
       VALUES (?, ?, ?, ?)`,
      [nombre_proovedor, compania, telefono, correo]
    );

    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, message: "Error al agregar proveedor" },
      { status: 500 }
    );
  }
}
