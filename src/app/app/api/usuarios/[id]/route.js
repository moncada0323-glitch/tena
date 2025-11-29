import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET(req, { params }) {
  try {
    const db = await connectDB();
    const { no_empleado } = params;

    const [rows] = await db.execute(
      "SELECT no_empleado FROM usuarios WHERE no_empleado = ?",
      [no_empleado]
    );

    if (rows.length === 0) {
      return NextResponse.json({ ok: false, message: "Usuario no encontrado" }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, message: "Error al obtener usuario" }, { status: 500 });
  }
}

export async function PUT(req, context) {
  try {
    const params = await context.params;
    const db = await connectDB();
    const { no_empleado } = params;
    const { contraseña } = await req.json();

    await db.execute(
      "UPDATE usuarios SET contrasena = ? WHERE no_empleado = ?",
      [contraseña, no_empleado]
    );

    return NextResponse.json({ ok: true, message: "Contraseña actualizada" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, message: "Error al actualizar usuario" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const db = await connectDB();
    const { no_empleado } = params;

    await db.execute("DELETE FROM usuarios WHERE no_empleado = ?", [no_empleado]);

    return NextResponse.json({ ok: true, message: "Usuario eliminado" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, message: "Error al eliminar usuario" }, { status: 500 });
  }
}
