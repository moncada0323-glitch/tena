import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    const db = await connectDB();

    const query = `
      SELECT p.id_producto, p.nombre_producto, p.precio, 
             tp.nombre_tipo,
             m.nombre_marca,
             pr.nombre_proovedor,
             p.stock,
             p.fecha_caducidad,
             r.no_rack
      FROM productos p
      LEFT JOIN tipo_producto tp ON p.tipo = tp.id_tipo
      LEFT JOIN marcas m ON p.marca = m.id_marca
      LEFT JOIN proovedor pr ON p.proovedor = pr.id_proovedor
      LEFT JOIN racks r ON p.no_rack = r.id_rack
      ORDER BY p.id_producto DESC
    `;

    const [rows] = await db.execute(query);
    return NextResponse.json(rows);

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, message: "Error al obtener productos" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
  const db = await connectDB();
 const {
  nombre_producto,
  precio,
  id_tipo,
  id_marca,
  id_proovedor,
  stock,
  fecha_caducidad,
  id_rack
} = await req.json();

await db.query(
  `INSERT INTO productos 
    (nombre_producto, precio, tipo, marca, proovedor, stock, fecha_caducidad, no_rack)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  [
    nombre_producto,
    precio,
    id_tipo,
    id_marca,
    id_proovedor,
    stock,
    fecha_caducidad,
    id_rack
  ]
);
    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, message: "Error al agregar producto" },
      { status: 500 }
    );
  }
}
