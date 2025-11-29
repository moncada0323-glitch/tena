import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db.js";

export async function GET() {
  try {
    const db = await connectDB();
    const query = `
      SELECT s.*, 
             c.nombre_cliente,
             p.nombre_producto
      FROM salidas s
      LEFT JOIN clientes c ON s.id_cliente = c.id_cliente
      LEFT JOIN productos p ON s.id_producto = p.id_producto
      ORDER BY s.id_salida DESC
    `;
    const [rows] = await db.query(query);

    return NextResponse.json(rows);
  } catch (err) {
    return NextResponse.json({ error: "Error al obtener salidas" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const db = await connectDB();
    const {
      id_cliente,
      id_producto,
      nombre_responsable,
      no_empleado,
      cantidad,
      fecha_salida,
      hora_salida
    } = await req.json();

    const query = `
      INSERT INTO salidas 
      (id_cliente, id_producto, nombre_responsable, no_empleado, cantidad, fecha_salida, hora_salida)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await db.query(query, [
      id_cliente,
      id_producto,
      nombre_responsable,
      no_empleado,
      cantidad,
      fecha_salida,
      hora_salida
    ]);

    return NextResponse.json({ message: "Salida registrada correctamente" });
  } catch (err) {
    return NextResponse.json({ error: "Error al registrar salida" }, { status: 500 });
  }
}
