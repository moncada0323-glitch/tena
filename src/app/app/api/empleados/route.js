import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db.js";

export async function GET(req) {
  try {
    const db = await connectDB();

    const { search, no_empleado } = Object.fromEntries(req.nextUrl.searchParams);

    if (!no_empleado) {
      return NextResponse.json([], { status: 400 });
    }

    const [empleadoActual] = await db.execute(
      `SELECT e.area, p.nombre_puesto AS puesto
       FROM empleados e
       LEFT JOIN puestos p ON e.puesto = p.id_puesto
       WHERE e.no_empleado = ?`,
      [no_empleado]
    );

    if (empleadoActual.length === 0) {
      return NextResponse.json([], { status: 404 });
    }

    const { area, puesto } = empleadoActual[0];

    let query = `
      SELECT 
        e.no_empleado, e.nombre, e.apellido, e.telefono, e.direccion,
        p.nombre_puesto AS puesto,
        a.nombre_area AS area,
        t.nombre_turno AS turno,
        e.area AS id_area
      FROM empleados e
      LEFT JOIN puestos p ON e.puesto = p.id_puesto
      LEFT JOIN areas a ON e.area = a.id_area
      LEFT JOIN turnos t ON e.turno = t.id_turno
    `;

    const params = [];
    const condiciones = [];

    if (search) {
      condiciones.push("(e.nombre LIKE ? OR e.apellido LIKE ?)");
      params.push(`%${search}%`, `%${search}%`);
    }

    if (puesto.toLowerCase() !== "ceo") {
      condiciones.push("e.area = ?");
      params.push(area);
    }

    condiciones.push("e.no_empleado <> ?");
    params.push(no_empleado);

    if (condiciones.length > 0) {
      query += " WHERE " + condiciones.join(" AND ");
    }

    query += " ORDER BY e.no_empleado DESC";

    const [rows] = await db.execute(query, params);

    const resultados = rows.map(({ id_area, ...resto }) => resto);

    return NextResponse.json(resultados);

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, message: "Error al obtener empleados" },
      { status: 500 }
    );
  }
}


export async function POST(req) {
  try {
    const data = await req.json();
    const { no_empleado, nombre, apellido, telefono, direccion, puesto, turno, area } = data;

    const db = await connectDB();
    const [exist] = await db.execute(
      "SELECT no_empleado FROM empleados WHERE no_empleado = ?",
      [no_empleado]
    );

    if (exist.length > 0) {
      return NextResponse.json(
        { ok: false, message: "El empleado ya existe" },
        { status: 400 }
      );
    }
    await db.execute(
      `INSERT INTO empleados (no_empleado, nombre, apellido, telefono, direccion, puesto, turno, area)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [no_empleado, nombre, apellido, telefono, direccion, puesto, turno, area]
    );

    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, message: "Error al agregar empleado" },
      { status: 500 }
    );
  }
}
