"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import localforage from "localforage";

import Vempleados from "./components/empleados/empleados";
import Ventradas from "./components/entradas/entradas";
import Vsalidas from "./components/salidas/salidas";
import Vareas from "./components/areas/areas";
import Vclientes from "./components/clientes/clientes";
import Vmarcas from "./components/marcas/marcas";
import Vproductos from "./components/productos/productos";
import Vproveedores from "./components/proveedores/proveedores";
import Vracks from "./components/racks/racks";
import Vtipo_producto from "./components/tipo_producto/tipo_producto";
import Vturno from "./components/turno/turno";
import Vusuarios from "./components/usuarios/usuarios";

export default function CEODashboard() {
  // SETEOS INICIALES
  const [seccion, setSeccion] = useState("Empleados");
  const [empleado, setEmpleado] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const router = useRouter();

  // USEEFFECT CORRECTO
  useEffect(() => {
    const loadEmpleado = async () => {
      const emp = await localforage.getItem("empleado");
      if (!emp) return router.push("/");

      setEmpleado(emp);
    };

    loadEmpleado();
  }, [router]);

  if (!empleado) {
    return (
      <div className="flex justify-center items-center h-screen text-blue-600 font-semibold">
        Cargando datos...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">

      {/* Botón móvil */}
      <button
        className="md:hidden absolute top-4 left-4 bg-blue-600 text-white px-3 py-2 rounded shadow-lg z-50"
        onClick={() => setMenuAbierto(!menuAbierto)}
      >
        ☰
      </button>

      {/* NAV */}
      <nav
        className={`fixed md:static top-0 left-0 h-full w-64 bg-white border-r border-gray-300 shadow-lg p-5 flex flex-col transform transition-transform duration-300 z-40
        ${menuAbierto ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold text-blue-600">Bienvenido</h2>
          <p className="text-gray-700 font-medium">
            {empleado.nombre} {empleado.apellido}
          </p>
          <p className="text-sm text-gray-500">{empleado.nombre_puesto}</p>
        </div>

        <div className="flex flex-col space-y-3">

          {[
            "Empleados",
            "Entradas",
            "Salidas",
            "Areas",
            "Clientes",
            "Marcas",
            "Productos",
            "Proveedores",
            "Racks",
            "Tipo_producto",
            "Turno",
            "Usuarios",
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSeccion(item);
                setMenuAbierto(false);
              }}
              className={`p-2 rounded text-left ${
                seccion === item
                  ? "bg-blue-600 text-white"
                  : "hover:bg-blue-100"
              }`}
            >
              {item.replace("_", " ")}
            </button>
          ))}

        </div>

        {/* CERRAR SESIÓN */}
        <button
          onClick={async () => {
            await localforage.removeItem("empleado");
            document.cookie =
              "sesion_usuario=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
            router.push("/");
          }}
          className="mt-auto bg-red-600 hover:bg-red-700 p-2 rounded text-white transition"
        >
          Salir
        </button>
      </nav>

      {/* CONTENIDO */}
      <main className="flex-1 p-8 overflow-y-auto md:ml-0 mt-12 md:mt-0">

        {seccion === "Empleados" && <Vempleados empleado={empleado} />}
        {seccion === "Entradas" && <Ventradas />}
        {seccion === "Salidas" && <Vsalidas />}
        {seccion === "Areas" && <Vareas />}
        {seccion === "Clientes" && <Vclientes />}
        {seccion === "Marcas" && <Vmarcas />}
        {seccion === "Productos" && <Vproductos />}
        {seccion === "Proveedores" && <Vproveedores />}
        {seccion === "Racks" && <Vracks />}
        {seccion === "Tipo_producto" && <Vtipo_producto />}
        {seccion === "Turno" && <Vturno />}
        {seccion === "Usuarios" && <Vusuarios />}

      </main>
    </div>
  );
}
