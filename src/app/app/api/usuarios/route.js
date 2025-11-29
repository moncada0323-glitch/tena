import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    const db = await connectDB();
    const [rows] = await db.execute("SELECT no_empleado FROM usuarios");
    return NextResponse.json(rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, message: "Error al obtener usuarios" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { no_empleado, contraseña = "123456" } = await req.json();
    const db = await connectDB();
    
    const [exist] = await db.execute(
      "SELECT no_empleado FROM usuarios WHERE no_empleado = ?",
      [no_empleado]
    );

    if (exist.length > 0) {
      return NextResponse.json({ ok: false, message: "Usuario ya existe" }, { status: 400 });
    }

    await db.execute(
      "INSERT INTO usuarios (no_empleado, contrasena) VALUES (?, ?)",
      [no_empleado, contraseña]
    );

    return NextResponse.json({ ok: true, message: "Usuario creado" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, message: "Error al crear usuario" }, { status: 500 });
  }
}
