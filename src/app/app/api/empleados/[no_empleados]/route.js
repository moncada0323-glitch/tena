import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db.js";

export async function PUT(req, context) {
  try {
    const { no_empleado } = await context.params;

    const {
      nombre,
      apellido,
      telefono,
      direccion,
      puesto,
      turno,
      area
    } = await req.json();

    const db = await connectDB();

    await db.execute(
      `UPDATE empleados SET
        nombre = ?, apellido = ?, telefono = ?, direccion = ?,
        puesto = ?, turno = ?, area = ?
       WHERE no_empleado = ?`,
      [nombre, apellido, telefono, direccion, puesto, turno, area, no_empleado]
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, message: "Error al actualizar empleado" },
      { status: 500 }
    );
  }
}


export async function DELETE(req, context) {
  try {
    const { no_empleado } = await context.params;

    const db = await connectDB();

    await db.execute("DELETE FROM empleados WHERE no_empleado = ?", [
      no_empleado,
    ]);

    await db.execute("DELETE FROM usuarios WHERE no_empleado = ?", [
      no_empleado,
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, message: "Error al eliminar empleado" },
      { status: 500 }
    );
  }
}
