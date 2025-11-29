"use client";
import { useEffect, useState } from "react";
import ModalAgregarRack from "./modals/ModalAgregarRack";
import ModalEditarRack from "./modals/ModalEditarRack";

export default function Racks() {
  const [racks, setRacks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const perPage = 10;

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    cargarRacks();
  }, []);

  const cargarRacks = async () => {
    const res = await fetch("/api/racks");
    const data = await res.json();
    setRacks(data);
    setFiltered(data);
  };

  const buscar = (term) => {
    setSearch(term);

    if (!term.trim()) {
      setFiltered(racks);
      return;
    }

    const results = racks.filter((r) =>
      r.no_rack.toString().includes(term)
    );

    setFiltered(results);
    setPage(1);
  };

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const eliminarRack = async (id) => {
    if (!confirm("¿Eliminar este rack?")) return;

    const res = await fetch(`/api/racks/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (data.ok) cargarRacks();
    else alert(data.error);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gestor de Racks</h2>

      <div className="flex justify-between mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => buscar(e.target.value)}
          placeholder="Buscar por número..."
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
              <th className="px-3 py-2 border">Número de Rack</th>
              <th className="px-3 py-2 border">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((r) => (
              <tr key={r.id_rack}>
                <td className="p-2 border">{r.id_rack}</td>
                <td className="p-2 border">{r.no_rack}</td>
                <td className="p-2 border space-x-2">
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                    onClick={() => {
                      setSelected(r);
                      setOpenEdit(true);
                    }}
                  >
                    Editar
                  </button>

                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded"
                    onClick={() => eliminarRack(r.id_rack)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

            {paginated.length === 0 && (
              <tr>
                <td colSpan="3" className="p-4 text-gray-500">
                  No se encontraron racks.
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

      <ModalAgregarRack
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSuccess={cargarRacks}
      />

      <ModalEditarRack
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        rack={selected}
        onSuccess={cargarRacks}
      />
    </div>
  );
}
