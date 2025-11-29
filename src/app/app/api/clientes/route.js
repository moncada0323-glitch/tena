import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    const db = await connectDB();

    const [rows] = await db.execute(`
      SELECT id_cliente, nombre_cliente, apellido, direccion, correo, telefono
      FROM clientes
      ORDER BY id_cliente DESC
    `);

    return NextResponse.json(rows);

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, message: "Error al obtener clientes" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { nombre_cliente, apellido, direccion, correo, telefono } = await req.json();
    const db = await connectDB();

    await db.execute(
      `INSERT INTO clientes (nombre_cliente, apellido, direccion, correo, telefono)
       VALUES (?, ?, ?, ?, ?)`,
      [nombre_cliente, apellido, direccion, correo, telefono]
    );

    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, message: "Error al agregar cliente" },
      { status: 500 }
    );
  }
}
