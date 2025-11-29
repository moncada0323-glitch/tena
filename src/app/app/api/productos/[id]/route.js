import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET(req, { params }) {
  try {
    const db = await connectDB();
    const { id } = params;

    const query = `
      SELECT p.id_producto, p.nombre_producto, p.precio, 
             p.tipo, p.marca, p.proovedor, p.stock, 
             p.fecha_caducidad, p.no_rack
      FROM productos p
      WHERE p.id_producto = ?
    `;

    const [rows] = await db.execute(query, [id]);

    if (rows.length === 0) {
      return NextResponse.json({ ok: false, message: "Producto no encontrado" }, { status: 404 });
    }

    return NextResponse.json(rows[0]);

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, message: "Error al obtener producto" },
      { status: 500 }
    );
  }
}

export async function PUT(req, context) {
  try {
    const params = await context.params;
    const db = await connectDB();
    const { id } = params;

    const {
      nombre_producto,
      precio,
      tipo,
      marca,
      proovedor,
      stock,
      fecha_caducidad,
      no_rack
    } = await req.json();

    await db.execute(
      `UPDATE productos SET 
        nombre_producto = ?, 
        precio = ?, 
        tipo = ?, 
        marca = ?, 
        proovedor = ?, 
        stock = ?, 
        fecha_caducidad = ?, 
        no_rack = ?
      WHERE id_producto = ?`,
      [
        nombre_producto,
        precio,
        tipo,
        marca,
        proovedor,
        stock,
        fecha_caducidad,
        no_rack,
        id
      ]
    );

    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, message: "Error al actualizar producto" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, context) {
  try {
    const params = await context.params;
    const db = await connectDB();
    const { id } = params;

    await db.execute(`DELETE FROM productos WHERE id_producto = ?`, [id]);

    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, message: "Error al eliminar producto" },
      { status: 500 }
    );
  }
}


