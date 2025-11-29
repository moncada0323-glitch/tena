import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function POST(req) {
  try {
    const { no_empleado, contraseña } = await req.json();
    const db = await connectDB();

    const [userRows] = await db.execute(
      "SELECT * FROM usuarios WHERE no_empleado = ? AND contrasena = ?",
      [no_empleado, contraseña]
    );

    if (userRows.length === 0) {
      return NextResponse.json(
        { error: "Credenciales incorrectas" },
        { status: 401 }
      );
    }

    const [empleadoRows] = await db.execute(
      `SELECT 
         e.no_empleado,
         e.nombre,
         e.apellido,
         p.nombre_puesto,
         a.nombre_area
       FROM empleados e
       LEFT JOIN puestos p ON e.puesto = p.id_puesto
       LEFT JOIN areas a ON e.area = a.id_area
       WHERE e.no_empleado = ?`,
      [no_empleado]
    );

    if (empleadoRows.length === 0) {
      return NextResponse.json(
        { error: "Empleado no encontrado" },
        { status: 404 }
      );
    }

    const empleado = empleadoRows[0];

    if (  
      empleado.nombre_area === null ||
      empleado.nombre_area === "" ||
      empleado.nombre_area === undefined
    ) {
    
        
      if (empleado.nombre_puesto?.toLowerCase().trim() === "ceo") {
        empleado.nombre_area = null;
      } else {
        return NextResponse.json(
      { error: "Empleado sin área asignada. Contacte al administrador." },
      { status: 403 }
    );
  }
}

    return NextResponse.json({
      message: "Login exitoso",
      empleado,
    });

  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
