import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db.js";

export async function GET(_, { params }) {
  try {
    const db = await connectDB();
    const [rows] = await db.query("SELECT * FROM racks WHERE id_rack = ?", [params.id]);

    if (rows.length === 0)
      return NextResponse.json({ error: "Rack no encontrado" }, { status: 404 });

    return NextResponse.json(rows[0]);
  } catch (err) {
    return NextResponse.json({ error: "Error al obtener rack" }, { status: 500 });
  }
}

export async function PUT(req, context) {
  try {
    const db = await connectDB();
    const params = await context.params;
    const { id } = params;
    const { no_rack } = await req.json();

    if (!no_rack) {
      return NextResponse.json(
        { error: "El número de rack es obligatorio" },
        { status: 400 }
      );
    }

    const query = "UPDATE racks SET no_rack = ? WHERE id_rack = ?";
    const [result] = await db.query(query, [no_rack, id]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Rack no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Rack actualizado correctamente" });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al actualizar rack" },
      { status: 500 }
    );
  }
}


export async function DELETE(req, context) {
  try {
    const params = await context.params;
    const { id } = params;
    const db = await connectDB();

    await db.query(`DELETE FROM racks WHERE id_rack = ?`, [id]);

    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, message: "Error al eliminar marca" },
      { status: 500 }
    );
  }
}g