"use client";
import { useState, useEffect } from "react";
import ModalEditarUsuario from "./modal/ModalEditarUsuario";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const perPage = 10;

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    const res = await fetch("/api/usuarios");
    const data = await res.json();
    setUsuarios(data);
    setFiltered(data);
  };

  const buscar = (term) => {
    setSearch(term);
    if (!term.trim()) {
      setFiltered(usuarios);
      return;
    }
    const results = usuarios.filter((u) =>
      u.no_empleado.toString().includes(term)
    );
    setFiltered(results);
    setPage(1);
  };

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const eliminarUsuario = async (no_empleado) => {
    if (!confirm("¿Eliminar este usuario?")) return;

    const res = await fetch(`/api/usuarios/${no_empleado}`, { method: "DELETE" });
    const data = await res.json();

    if (data.ok) cargarUsuarios();
    else alert(data.error);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gestor de Usuarios</h2>

      <div className="flex justify-between mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => buscar(e.target.value)}
          placeholder="Buscar por No. empleado..."
          className="border p-2 rounded w-60"
        />

      </div>

      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 border">No. Empleado</th>
              <th className="px-3 py-2 border">Contraseña</th>
              <th className="px-3 py-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((u) => (
              <tr key={u.no_empleado}>
                <td className="p-2 border">{u.no_empleado}</td>
                <td className="p-2 border">••••••••</td>
                <td className="p-2 border space-x-2">
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                    onClick={() => {
                      setSelected(u);
                      setOpenEdit(true);
                    }}
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}

            {paginated.length === 0 && (
              <tr>
                <td colSpan="3" className="p-4 text-gray-500">
                  No se encontraron usuarios.
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

      <ModalEditarUsuario
        open={openEdit}
        usuario={selected}
        onClose={() => setOpenEdit(false)}
        onSuccess={cargarUsuarios}
      />
    </div>
  );
}
