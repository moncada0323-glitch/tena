"use client";
import { useEffect, useState } from "react";
import ModalAgregarTipoProducto from "./modals/ModalAgregarTipoProducto";
import ModalEditarTipoProducto from "./modals/ModalEditarTipoProducto";

export default function TipoProductos() {
  const [tipos, setTipos] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const perPage = 10;

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    cargarTipos();
  }, []);

  const cargarTipos = async () => {
    const res = await fetch("/api/tipo_productos");
    const data = await res.json();
    setTipos(data);
    setFiltered(data);
  };

  const buscar = (term) => {
    setSearch(term);

    if (!term.trim()) {
      setFiltered(tipos);
      return;
    }

    const results = tipos.filter((t) =>
      t.nombre_tipo.toLowerCase().includes(term.toLowerCase())
    );

    setFiltered(results);
    setPage(1);
  };

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const eliminarTipo = async (id) => {
    if (!confirm("¿Eliminar este tipo de producto?")) return;

    const res = await fetch(`/api/tipo_productos/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (data.ok) cargarTipos();
    else alert(data.error);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gestor de Tipos de Productos</h2>

      <div className="flex justify-between mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => buscar(e.target.value)}
          placeholder="Buscar tipo..."
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
              <th className="px-3 py-2 border">ID</th>
              <th className="px-3 py-2 border">Nombre Tipo</th>
              <th className="px-3 py-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((t) => (
              <tr key={t.id_tipo}>
                <td className="p-2 border">{t.id_tipo}</td>
                <td className="p-2 border">{t.nombre_tipo}</td>
                <td className="p-2 border space-x-2">
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                    onClick={() => {
                      setSelected(t);
                      setOpenEdit(true);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded"
                    onClick={() => eliminarTipo(t.id_tipo)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan="3" className="p-4 text-gray-500">
                  No se encontraron tipos.
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

      <ModalAgregarTipoProducto
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSuccess={cargarTipos}
      />
      <ModalEditarTipoProducto
        open={openEdit}
        tipo={selected}
        onClose={() => setOpenEdit(false)}
        onSuccess={cargarTipos}
      />
    </div>
  );
}
