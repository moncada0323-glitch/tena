import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET(req, { params }) {
  try {
    const { id } = params;
    const db = await connectDB();

    const [rows] = await db.execute(
      `SELECT id_marca, nombre_marca
       FROM marcas
       WHERE id_marca = ?`,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { ok: false, message: "Marca no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, message: "Error al obtener marca" },
      { status: 500 }
    );
  }
}

export async function PUT(req, context) {
  try {
    const params = await context.params;
    const { id } = params;
    const { nombre_marca } = await req.json();
    const db = await connectDB();

    await db.execute(
      `UPDATE marcas
       SET nombre_marca = ?
       WHERE id_marca = ?`,
      [nombre_marca, id]
    );

    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, message: "Error al actualizar marca" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, context) {
  try {
    const params = await context.params;
    const { id } = params;
    const db = await connectDB();

    await db.execute(`DELETE FROM marcas WHERE id_marca = ?`, [id]);

    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, message: "Error al eliminar marca" },
      { status: 500 }
    );
  }
}