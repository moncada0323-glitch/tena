"use client";

import { useState, useEffect } from "react";
import ModalAgregarEntrada from "./modals/ModalAgregarEntrada";
import ModalEditarEntrada from "./modals/ModalEditarEntrada";

export default function Entradas() {
  const [entradas, setEntradas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openAgregar, setOpenAgregar] = useState(false);
  const [openEditar, setOpenEditar] = useState(false);
  const [entradaEditar, setEntradaEditar] = useState(null);

  const [pagina, setPagina] = useState(1);
  const [porPagina] = useState(8);

  const [busqueda, setBusqueda] = useState("");

const fetchEntradas = async () => {
  setLoading(true);

  try {
    const res = await fetch("/api/entradas");
    const data = await res.json();

    if (!Array.isArray(data)) {
      console.error("La API no regresó un array:", data);
      setEntradas([]);
    } else {
      setEntradas(data);
    }
  } catch (e) {
    console.error("Error al obtener entradas:", e);
    setEntradas([]);
  }

  setLoading(false);
};

  useEffect(() => {
    fetchEntradas();
  }, []);

  const filtradas = entradas.filter((e) =>
    Object.values(e).some((v) =>
      String(v).toLowerCase().includes(busqueda.toLowerCase())
    )
  );

  const totalPaginas = Math.ceil(filtradas.length / porPagina);
  const inicio = (pagina - 1) * porPagina;
  const visibles = filtradas.slice(inicio, inicio + porPagina);

  const eliminarEntrada = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar esta entrada?")) return;

    const res = await fetch(`/api/entradas/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    fetchEntradas();
  };

  return (
    <div className="p-6 bg-gray-50 h-full w-full">
      <h2 className="text-2xl font-bold mb-4">Gestor de Entradas</h2>

      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Buscar..."
          className="border p-2 rounded w-60"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <button
          onClick={() => setOpenAgregar(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          + Agregar Entrada
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Proveedor</th>
              <th className="p-3 border">Producto</th>
              <th className="p-3 border">Responsable</th>
              <th className="p-3 border">Empleado</th>
              <th className="p-3 border">Cantidad</th>
              <th className="p-3 border">Fecha</th>
              <th className="p-3 border">Hora</th>
              <th className="p-3 border">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center p-4">
                  Cargando...
                </td>
              </tr>
            ) : visibles.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center p-4">
                  No hay resultados
                </td>
              </tr>
            ) : (
              visibles.map((e) => (
                <tr key={e.id_entrada}>
                  <td className="p-3 border">{e.id_entrada}</td>
                  <td className="p-3 border">{e.nombre_proovedor}</td>
                  <td className="p-3 border">{e.nombre_producto}</td>
                  <td className="p-3 border">{e.nombre_responsable}</td>
                  <td className="p-3 border">{e.no_empleado}</td>
                  <td className="p-3 border">{e.cantidad}</td>
                  <td className="p-3 border">{e.fecha_entrega}</td>
                  <td className="p-3 border">{e.hora_entrega}</td>

                  <td className="p-3 border">
                    <button
                      onClick={() => {
                        setEntradaEditar(e);
                        setOpenEditar(true);
                      }}
                      className="bg-blue-600 text-white px-2 py-1 rounded mr-2"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => eliminarEntrada(e.id_entrada)}
                      className="bg-red-600 text-white px-2 py-1 rounded"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center space-x-2 mt-4">
        <button
          disabled={pagina === 1}
          onClick={() => setPagina(pagina - 1)}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Anterior
        </button>

        <span className="px-3 py-1">
          {pagina} / {totalPaginas}
        </span>

        <button
          disabled={pagina === totalPaginas}
          onClick={() => setPagina(pagina + 1)}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>

      <ModalAgregarEntrada
        open={openAgregar}
        onClose={() => setOpenAgregar(false)}
        onSuccess={fetchEntradas}
      />

      {entradaEditar && (
        <ModalEditarEntrada
          open={openEditar}
          onClose={() => setOpenEditar(false)}
          entrada={entradaEditar}
          onSuccess={fetchEntradas}
        />
      )}
    </div>
  );
}
