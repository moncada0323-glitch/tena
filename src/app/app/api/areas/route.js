mport { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    const db = await connectDB();
    const [rows] = await db.execute(`
      SELECT id_area, nombre_area 
      FROM areas ORDER BY nombre_area ASC
    `);

    return NextResponse.json(rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { nombre_area } = await req.json();
    const db = await connectDB();

    await db.execute(
      "INSERT INTO areas (nombre_area) VALUES (?)",
      [nombre_area]
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
