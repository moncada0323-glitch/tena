import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db.js";

export async function GET() {
  try {
    const db = await connectDB();
    const [rows] = await db.query("SELECT * FROM racks ORDER BY id_rack ASC");
    return NextResponse.json(rows);
  } catch (err) {
    return NextResponse.json({ error: "Error al obtener racks" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const db = await connectDB();
    const { no_rack } = await req.json();

    if (!no_rack)
      return NextResponse.json({ error: "El número de rack es obligatorio" }, { status: 400 });

    await db.query("INSERT INTO racks (no_rack) VALUES (?)", [no_rack]);

    return NextResponse.json({ message: "Rack creado correctamente" });
  } catch (err) {
    return NextResponse.json({ error: "Error al crear rack" }, { status: 500 });
  }
}

