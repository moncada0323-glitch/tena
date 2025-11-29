"use client";
import { useState, useEffect } from "react";
import ModalAgregarEmpleado from "./modals/ModalAgregarEmpleado";
import ModalEditarEmpleado from "./modals/ModalEditarEmpleado";

export default function Empleados({ empleado }) {
  const [empleados, setEmpleados] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const perPage = 10;

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!empleado) return;

    const cargarEmpleados = async () => {
      const res = await fetch(`/api/empleados?no_empleado=${empleado.no_empleado}`);
      const data = await res.json();
      setEmpleados(data);
      setFiltered(data);
    };

    cargarEmpleados();
  }, [empleado]);

  const buscar = (term) => {
    setSearch(term);
    if (!term.trim()) return setFiltered(empleados);

    const results = empleados.filter((e) =>
      e.nombre.toLowerCase().includes(term.toLowerCase()) ||
      e.apellido.toLowerCase().includes(term.toLowerCase()) ||
      e.no_empleado.toString().includes(term)
    );
    setFiltered(results);
    setPage(1);
  };

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const eliminarEmpleado = async (id) => {
    if (!confirm("¿Eliminar este empleado?")) return;
    const res = await fetch(`/api/empleados/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.ok) {
      const res2 = await fetch(`/api/empleados?no_empleado=${empleado.no_empleado}`);
      const newData = await res2.json();
      setEmpleados(newData);
      setFiltered(newData);
    } else alert(data.error);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gestor de Empleados</h2>

      <div className="flex justify-between mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => buscar(e.target.value)}
          placeholder="Buscar..."
          className="border p-2 rounded w-60"
        />

        <button
          onClick={() => setOpenAdd(true)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Agregar
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 border">No. Empleado</th>
              <th className="px-3 py-2 border">Nombre</th>
              <th className="px-3 py-2 border">Apellido</th>
              <th className="px-3 py-2 border">Teléfono</th>
              <th className="px-3 py-2 border">Dirección</th>
              <th className="px-3 py-2 border">Puesto</th>
              <th className="px-3 py-2 border">Área</th>
              <th className="px-3 py-2 border">Turno</th>
              <th className="px-3 py-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((e) => (
              <tr key={e.no_empleado}>
                <td className="p-2 border">{e.no_empleado}</td>
                <td className="p-2 border">{e.nombre}</td>
                <td className="p-2 border">{e.apellido}</td>
                <td className="p-2 border">{e.telefono}</td>
                <td className="p-2 border">{e.direccion}</td>
                <td className="p-2 border">{e.puesto}</td>
                <td className="p-2 border">{e.area}</td>
                <td className="p-2 border">{e.turno}</td>
                <td className="p-2 border space-x-2">
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                    onClick={() => { setSelected(e); setOpenEdit(true); }}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded"
                    onClick={() => eliminarEmpleado(e.no_empleado)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

            {paginated.length === 0 && (
              <tr>
                <td colSpan="9" className="p-4 text-gray-500">
                  No se encontraron empleados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4 space-x-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-1 bg-gray-300 rounded"
        >
          Anterior
        </button>

        <span className="px-4 py-1 bg-gray-200 rounded">
          Página {page} de {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-1 bg-gray-300 rounded"
        >
          Siguiente
        </button>
      </div>

      <ModalAgregarEmpleado
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSuccess={() => {
          fetch(`/api/empleados?no_empleado=${empleado.no_empleado}`)
            .then((res) => res.json())
            .then((data) => {
              setEmpleados(data);
              setFiltered(data);
            });
        }}
      />

    <ModalEditarEmpleado
  open={openEdit}
  empleadoEdit={selected}
  empleadoLog={empleado}
  onClose={() => setOpenEdit(false)}
  onSuccess={() => {
    fetch(`/api/empleados?no_empleado=${empleado.no_empleado}`)
      .then((res) => res.json())
      .then((data) => {
        setEmpleados(data);
        setFiltered(data);
      });
  }}
/>
    </div>
  );
}
