"use client";
import { useEffect, useState } from "react";
import ModalAgregarTurno from "./modals/ModalAgregarTurno";
import ModalEditarTurno from "./modals/ModalEditarTurno";

export default function Turnos() {
  const [turnos, setTurnos] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const perPage = 10;

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    cargarTurnos();
  }, []);

  const cargarTurnos = async () => {
    const res = await fetch("/api/turnos");
    const data = await res.json();
    setTurnos(data);
    setFiltered(data);
  };

  const buscar = (term) => {
    setSearch(term);

    if (!term.trim()) {
      setFiltered(turnos);
      return;
    }

    const results = turnos.filter((t) =>
      t.nombre_turno.toLowerCase().includes(term.toLowerCase())
    );

    setFiltered(results);
    setPage(1);
  };

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const eliminarTurno = async (id) => {
    if (!confirm("¿Eliminar este turno?")) return;

    const res = await fetch(`/api/turnos/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (data.ok) cargarTurnos();
    else alert(data.error);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gestor de Turnos</h2>

      <div className="flex justify-between mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => buscar(e.target.value)}
          placeholder="Buscar turno..."
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
              <th className="px-3 py-2 border">Nombre Turno</th>
              <th className="px-3 py-2 border">Hora Entrada</th>
              <th className="px-3 py-2 border">Hora Salida</th>
              <th className="px-3 py-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((t) => (
              <tr key={t.id_turno}>
                <td className="p-2 border">{t.id_turno}</td>
                <td className="p-2 border">{t.nombre_turno}</td>
                <td className="p-2 border">{t.hora_entrada}</td>
                <td className="p-2 border">{t.hora_salida}</td>
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
                    onClick={() => eliminarTurno(t.id_turno)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-gray-500">
                  No se encontraron turnos.
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
      
      <ModalAgregarTurno
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSuccess={cargarTurnos}
      />
      <ModalEditarTurno
        open={openEdit}
        turno={selected}
        onClose={() => setOpenEdit(false)}
        onSuccess={cargarTurnos}
      />
    </div>
  );
}
