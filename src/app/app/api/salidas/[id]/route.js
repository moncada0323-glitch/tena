import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db.js";

export async function GET(_, { params }) {
  try {
    const db = await connectDB();
    const [rows] = await db.query("SELECT * FROM salidas WHERE id_salida = ?", [params.id]);

    if (!rows.length)
      return NextResponse.json({ error: "Salida no encontrada" }, { status: 404 });

    return NextResponse.json(rows[0]);
  } catch (err) {
    return NextResponse.json({ error: "Error al obtener salida" }, { status: 500 });
  }
}

export async function PUT(req, context) {
  try {
    const db = await connectDB();
    const params = await context.params;
    const data = await req.json();

    const query = `
      UPDATE salidas SET
      id_cliente = ?, id_producto = ?, nombre_responsable = ?, 
      no_empleado = ?, cantidad = ?, fecha_salida = ?, hora_salida = ?
      WHERE id_salida = ?
    `;

    const values = [
      data.id_cliente,
      data.id_producto,
      data.nombre_responsable,
      data.no_empleado,
      data.cantidad,
      data.fecha_salida,
      data.hora_salida,
      params.id
    ];

    const [result] = await db.query(query, values);

    if (result.affectedRows === 0)
      return NextResponse.json({ error: "Salida no encontrada" }, { status: 404 });

    return NextResponse.json({ message: "Salida actualizada correctamente" });
  } catch (err) {
    return NextResponse.json({ error: "Error al actualizar salida" }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  try {
    const db = await connectDB();
    const params = await context.params;
    const [result] = await db.query("DELETE FROM salidas WHERE id_salida = ?", [params.id]);

    if (result.affectedRows === 0)
      return NextResponse.json({ error: "Salida no encontrada" }, { status: 404 });

    return NextResponse.json({ message: "Salida eliminada correctamente" });
  } catch (err) {
    return NextResponse.json({ error: "Error al eliminar salida" }, { status: 500 });
  }
}

