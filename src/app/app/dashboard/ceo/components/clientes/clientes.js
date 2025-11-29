"use client";
import { useEffect, useState } from "react";
import ModalAgregarCliente from "./modals/ModalAgregarCliente";
import ModalEditarCliente from "./modals/ModalEditarCliente";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const perPage = 10;

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    const res = await fetch("/api/clientes");
    const data = await res.json();
    setClientes(data);
    setFiltered(data);
  };

  const buscar = (term) => {
    setSearch(term);

    if (term.trim() === "") {
      setFiltered(clientes);
      return;
    }

    const results = clientes.filter((c) =>
      `${c.nombre_cliente} ${c.apellido} ${c.correo}`
        .toLowerCase()
        .includes(term.toLowerCase())
    );

    setFiltered(results);
    setPage(1);
  };

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gestor de Clientes</h2>

      <div className="flex justify-between mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => buscar(e.target.value)}
          placeholder="Buscar cliente..."
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
              <th className="p-3 border">Nombre</th>
              <th className="p-3 border">Correo</th>
              <th className="p-3 border">Teléfono</th>
              <th className="p-3 border">Dirección</th>
              <th className="p-3 border">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((c) => (
              <tr key={c.id_cliente} className="text-center">
                <td className="p-3 border">{c.id_cliente}</td>
                <td className="p-3 border">
                  {c.nombre_cliente} {c.apellido}
                </td>
                <td className="p-3 border">{c.correo}</td>
                <td className="p-3 border">{c.telefono}</td>
                <td className="p-3 border">{c.direccion}</td>

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
                    onClick={() => eliminarCliente(c.id_cliente)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

            {paginated.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-gray-500">
                  No se encontraron clientes.
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

      <ModalAgregarCliente
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSuccess={cargarClientes}
      />

      <ModalEditarCliente
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        cliente={selected}
        onSuccess={cargarClientes}
      />
    </div>
  );

  async function eliminarCliente(id) {
    if (!confirm("¿Eliminar este cliente?")) return;

    const res = await fetch(`/api/clientes/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (data.ok) cargarClientes();
    else alert(data.error);
  }
}

