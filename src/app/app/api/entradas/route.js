import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db.js";

export async function GET() {
  try {
    const db = await connectDB();
    const query = `
      SELECT e.*, 
             p.nombre_proovedor,
             pr.nombre_producto
      FROM entradas e
      LEFT JOIN proovedor p ON e.id_proovedor = p.id_proovedor
      LEFT JOIN productos pr ON e.id_producto = pr.id_producto
      ORDER BY e.id_entrada DESC
    `;
    const [rows] = await db.query(query);

    return NextResponse.json(rows);
  } catch (err) {
    return NextResponse.json({ error: "Error al obtener entradas" }, { status: 500 });
  }
}


export async function POST(req) {
  try {
      const db = await connectDB();
    const {
      id_proovedor,
      id_producto,
      nombre_responsable,
      no_empleado,
      cantidad,
      fecha_entrega,
      hora_entrega
    } = await req.json();

    const query = `
      INSERT INTO entradas 
      (id_proovedor, id_producto, nombre_responsable, no_empleado, cantidad, fecha_entrega, hora_entrega)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await db.query(query, [
      id_proovedor,
      id_producto,
      nombre_responsable,
      no_empleado,
      cantidad,
      fecha_entrega,
      hora_entrega
    ]);

    return NextResponse.json({ message: "Entrada registrada correctamente" });
  } catch (err) {
    return NextResponse.json({ error: "Error al registrar entrada" }, { status: 500 });
  }
}
