"use client";

import { useState, useEffect } from "react";
import ModalAgregarSalida from "./modals/ModalAgregarSalida";
import ModalEditarSalida from "./modals/ModalEditarSalida";

export default function Salidas() {
  const [salidas, setSalidas] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [busqueda, setBusqueda] = useState("");
  const [modalAgregar, setModalAgregar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [salidaActual, setSalidaActual] = useState(null);

  const [paginaActual, setPaginaActual] = useState(1);
  const filasPorPagina = 10;

  const obtenerSalidas = async () => {
    setLoading(true);

    const res = await fetch("/api/salidas");
    const data = await res.json();

    setSalidas(data);
    setLoading(false); 
  };

  useEffect(() => {
    obtenerSalidas();
  }, []);


  const salidasFiltradas = salidas.filter((s) =>
    Object.values(s).some((val) =>
      String(val || "")
        .toLowerCase()
        .includes(busqueda.toLowerCase())
    )
  );


  const indexFinal = paginaActual * filasPorPagina;
  const indexInicial = indexFinal - filasPorPagina;
  const datosPagina = salidasFiltradas.slice(indexInicial, indexFinal);
  const totalPaginas = Math.ceil(salidasFiltradas.length / filasPorPagina);

  const eliminarSalida = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar esta salida?")) return;
    const res = await fetch(`/api/salidas/${id}`, { method: "DELETE" });
    if (res.ok) obtenerSalidas();
    else alert("Error al eliminar");
  };

  return (
    <div className="flex flex-col h-full w-full p-6 bg-gray-50">
      <h2 className="text-2xl font-bold mb-4">Gestor de Salidas</h2>

      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Buscar..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="border p-2 rounded w-64"
        />

        <button
          onClick={() => setModalAgregar(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          + Agregar
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Cliente</th>
              <th className="p-3 border">Producto</th>
              <th className="p-3 border">Responsable</th>
              <th className="p-3 border">No. Empleado</th>
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
            ) : datosPagina.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center p-4">
                  No hay resultados
                </td>
              </tr>
            ) : (
              datosPagina.map((s) => (
                <tr key={s.id_salida} className="text-center">
                  <td className="border p-2">{s.id_salida}</td>
                  <td className="border p-2">{s.nombre_cliente}</td>
                  <td className="border p-2">{s.nombre_producto}</td>
                  <td className="border p-2">{s.nombre_responsable}</td>
                  <td className="border p-2">{s.no_empleado}</td>
                  <td className="border p-2">{s.cantidad}</td>
                  <td className="border p-2">{s.fecha_salida}</td>
                  <td className="border p-2">{s.hora_salida}</td>

                  <td className="border p-2 space-x-2">
                    <button
                      onClick={() => {
                        setSalidaActual(s);
                        setModalEditar(true);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => eliminarSalida(s.id_salida)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
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

      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: totalPaginas }, (_, i) => (
          <button
            key={i}
            onClick={() => setPaginaActual(i + 1)}
            className={`px-3 py-1 border rounded ${
              paginaActual === i + 1 ? "bg-blue-600 text-white" : "bg-white"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {modalAgregar && (
        <ModalAgregarSalida
          open={modalAgregar}
          onClose={() => setModalAgregar(false)}
          onSuccess={obtenerSalidas}
        />
      )}

      {modalEditar && (
        <ModalEditarSalida
          open={modalEditar}
          onClose={() => setModalEditar(false)}
          salida={salidaActual}
          onSuccess={obtenerSalidas}
        />
      )}
    </div>
  );
}
