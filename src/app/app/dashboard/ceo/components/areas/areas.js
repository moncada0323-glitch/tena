"use client";
import { useState, useEffect } from "react";

export default function Areas() {
  const [areas, setAreas] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const perPage = 10;


  useEffect(() => {
    cargarAreas();
  }, []);

  const cargarAreas = async () => {
    const res = await fetch("/api/areas");
    const data = await res.json();
    setAreas(data);
    setFiltered(data);
  };

  const buscar = (term) => {
    setSearch(term);

    if (term.trim() === "") {
      setFiltered(areas);
      return;
    }

    const results = areas.filter((a) =>
      a.nombre_area.toLowerCase().includes(term.toLowerCase())
    );

    setFiltered(results);
    setPage(1);
  };

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gestor de Áreas</h2>

      <div className="flex justify-between mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => buscar(e.target.value)}
          placeholder="Buscar área..."
          className="border p-2 rounded w-60"
        />
      </div>

      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Nombre del Área</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((a) => (
              <tr key={a.id_area} className="text-center">
                <td className="p-3 border">{a.id_area}</td>
                <td className="p-3 border">{a.nombre_area}</td>
              </tr>
            ))}

            {paginated.length === 0 && (
              <tr>
                <td colSpan="3" className="p-4 text-gray-500">
                  No se encontraron áreas.
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
    </div>
  );

}
