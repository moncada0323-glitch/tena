import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET(req, { params }) {
  try {
    const { id } = params;
    const db = await connectDB();

    const [rows] = await db.execute(
      `SELECT id_proovedor, nombre_proovedor, compania, telefono, correo
       FROM proovedor
       WHERE id_proovedor = ?`,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { ok: false, message: "Proveedor no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, message: "Error al obtener proveedor" },
      { status: 500 }
    );
  }
}

export async function PUT(req, context) {
  try {
    const params = await context.params;
    const { id } = params;
    const { nombre_proovedor, compania, telefono, correo } = await req.json();
    const db = await connectDB();

    await db.execute(
      `UPDATE proovedor SET 
        nombre_proovedor = ?, 
        compania = ?, 
        telefono = ?, 
        correo = ?
       WHERE id_proovedor = ?`,
      [nombre_proovedor, compania, telefono, correo, id]
    );

    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, message: "Error al actualizar proveedor" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, context) {
  try {
    const params = await context.params;
    const { id } = params;
    const db = await connectDB();

    await db.execute(`DELETE FROM proovedor WHERE id_proovedor = ?`, [id]);

    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, message: "Error al eliminar proveedor" },
      { status: 500 }
    );
  }
}
