"use client";
import { useEffect, useState } from "react";
import ModalAgregarMarca from "./modals/ModalAgregarMarca";
import ModalEditarMarca from "./modals/ModalEditarMarca";

export default function Marcas() {
  const [marcas, setMarcas] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const perPage = 10;

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    cargarMarcas();
  }, []);

  const cargarMarcas = async () => {
    const res = await fetch("/api/marcas");
    const data = await res.json();
    setMarcas(data);
    setFiltered(data);
  };

  const buscar = (term) => {
    setSearch(term);

    if (term.trim() === "") {
      setFiltered(marcas);
      return;
    }

    const results = marcas.filter((c) =>
      c.nombre_marca.toLowerCase().includes(term.toLowerCase())
    );

    setFiltered(results);
    setPage(1);
  };

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  async function eliminarMarca(id) {
    if (!confirm("¿Eliminar esta marca?")) return;

    const res = await fetch(`/api/marcas/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (data.ok) cargarMarcas();
    else alert(data.error);
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gestor de Marcas</h2>

      <div className="flex justify-between mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => buscar(e.target.value)}
          placeholder="Buscar marca..."
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
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Marca</th>
              <th className="p-3 border">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((c) => (
              <tr key={c.id_marca} className="text-center">
                <td className="p-3 border">{c.id_marca}</td>
                <td className="p-3 border">{c.nombre_marca}</td>

                <td className="p-3 border space-x-2">
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                    onClick={() => {
                      setSelected(c);
                      setOpenEdit(true);
                    }}
                  >
                    Editar
                  </button>

                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded"
                    onClick={() => eliminarMarca(c.id_marca)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

            {paginated.length === 0 && (
              <tr>
                <td colSpan="3" className="p-4 text-gray-500">
                  No se encontraron marcas.
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

      <ModalAgregarMarca
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSuccess={cargarMarcas}
      />

      <ModalEditarMarca
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        marca={selected}
        onSuccess={cargarMarcas}
      />
    </div>
  );
}
