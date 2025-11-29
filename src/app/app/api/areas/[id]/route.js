import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET(req, { params }) {
  try {
    const db = await connectDB();
    const [rows] = await db.execute(
      "SELECT id_area, nombre_area FROM areas WHERE id_area = ?",
      [params.id]
    );

    return NextResponse.json(rows[0] || {});
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { nombre_area } = await req.json();
    const db = await connectDB();

    await db.execute(
      "UPDATE areas SET nombre_area = ? WHERE id_area = ?",
      [nombre_area, params.id]
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const db = await connectDB();

    await db.execute("DELETE FROM areas WHERE id_area = ?", [params.id]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
