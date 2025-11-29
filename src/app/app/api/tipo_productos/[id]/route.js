import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db.js";

export async function GET(_, { params }) {
  try {
    const db = await connectDB();
    const { id } = params;

    const query = "SELECT * FROM tipo_producto WHERE id_tipo = ?";
    const [rows] = await db.query(query, [id]);

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Tipo de producto no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener el tipo de producto" },
      { status: 500 }
    );
  }
}

export async function PUT(req, context) {
  try {
    const db = await connectDB();
    const params = await context.params;
    const { id } = params;
    const { nombre_tipo } = await req.json();

    if (!nombre_tipo) {
      return NextResponse.json(
        { error: "El nombre del tipo es obligatorio" },
        { status: 400 }
      );
    }

    const query = "UPDATE tipo_producto SET nombre_tipo = ? WHERE id_tipo = ?";
    const [result] = await db.query(query, [nombre_tipo, id]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Tipo de producto no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Tipo de producto actualizado exitosamente" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar el tipo de producto" },
      { status: 500 }
    );
  }
}


export async function DELETE(req, context) {
  try {
    const params = await context.params;
    const { id } = params;
    const db = await connectDB();

    await db.execute(`DELETE FROM tipo_producto WHERE id_tipo = ?`, [id]);

    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, message: "Error al eliminar marca" },
      { status: 500 }
    );
  }
}