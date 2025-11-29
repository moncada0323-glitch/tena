import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db.js";

export async function GET() {
  try {
    const db = await connectDB();
    const query = "SELECT * FROM tipo_producto ORDER BY id_tipo ASC";
    const [rows] = await db.query(query);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener los tipos de producto" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const db = await connectDB();
    const { nombre_tipo } = await req.json();

    if (!nombre_tipo) {
      return NextResponse.json(
        { error: "El nombre del tipo es obligatorio" },
        { status: 400 }
      );
    }

    const query = "INSERT INTO tipo_producto (nombre_tipo) VALUES (?)";
    await db.query(query, [nombre_tipo]);

    return NextResponse.json({ message: "Tipo de producto creado correctamente" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear el tipo de producto" },
      { status: 500 }
    );
  }
}
