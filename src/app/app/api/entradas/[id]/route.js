import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db.js";

export async function GET(_, { params }) {
  try {
    const db = await connectDB();
    const [rows] = await db.query("SELECT * FROM entradas WHERE id_entrada = ?", [params.id]);

    if (!rows.length)
      return NextResponse.json({ error: "Entrada no encontrada" }, { status: 404 });

    return NextResponse.json(rows[0]);
  } catch (err) {
    return NextResponse.json({ error: "Error al obtener entrada" }, { status: 500 });
  }
}

export async function PUT(req, context) {
  try {
     const db = await connectDB();
    const params = await context.params;
    const data = await req.json();
    
    const query = `
      UPDATE entradas SET
      id_proovedor = ?, id_producto = ?, nombre_responsable = ?, 
      no_empleado = ?, cantidad = ?, fecha_entrega = ?, hora_entrega = ?
      WHERE id_entrada = ?
    `;

    const values = [
      data.id_proovedor,
      data.id_producto,
      data.nombre_responsable,
      data.no_empleado,
      data.cantidad,
      data.fecha_entrega,
      data.hora_entrega,
      params.id
    ];

    const [result] = await db.query(query, values);

    if (result.affectedRows === 0)
      return NextResponse.json({ error: "Entrada no encontrada" }, { status: 404 });

    return NextResponse.json({ message: "Entrada actualizada correctamente" });
  } catch (err) {
    return NextResponse.json({ error: "Error al actualizar entrada" }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  try {
     const db = await connectDB();
    const params = await context.params;
    const [result] = await db.query("DELETE FROM entradas WHERE id_entrada = ?", [params.id]);

    if (result.affectedRows === 0)
      return NextResponse.json({ error: "Entrada no encontrada" }, { status: 404 });

    return NextResponse.json({ message: "Entrada eliminada correctamente" });
  } catch (err) {
    return NextResponse.json({ error: "Error al eliminar entrada" }, { status: 500 });
  }
}
