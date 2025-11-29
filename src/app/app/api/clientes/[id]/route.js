import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET(req, { params }) {
  try {
    const { id } = params;
    const db = await connectDB();

    const [rows] = await db.execute(
      `SELECT id_cliente, nombre_cliente, apellido, direccion, correo, telefono
       FROM clientes
       WHERE id_cliente = ?`,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { ok: false, message: "Cliente no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, message: "Error al obtener cliente" },
      { status: 500 }
    );
  }
}

export async function PUT(req, context) {
  const params = await context.params; 
  const { id } = params;

  const body = await req.json();
  const { nombre_cliente, apellido, direccion, correo, telefono } = body;

  const db = await connectDB();

  await db.query(
    `UPDATE clientes SET 
      nombre_cliente = ?, 
      apellido = ?, 
      direccion = ?, 
      correo = ?, 
      telefono = ?
     WHERE id_cliente = ?`,
    [nombre_cliente, apellido, direccion, correo, telefono, id]
  );

  return NextResponse.json({ ok: true });
}

export async function DELETE(req, context) {
  try {
    const params = await context.params;
    const { id } = params;
    const db = await connectDB();

    await db.query(`DELETE FROM clientes WHERE id_cliente = ?`, [id]);

    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, message: "Error al eliminar cliente" },
      { status: 500 }
    );
  }
}
