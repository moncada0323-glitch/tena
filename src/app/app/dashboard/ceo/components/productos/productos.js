"use client";
import { useEffect, useState } from "react";
import ModalAgregarProducto from "./modals/ModalAgregarProducto";
import ModalEditarProducto from "./modals/ModalEditarProducto";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const perPage = 10;

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    const res = await fetch("/api/productos");
    const data = await res.json();
    setProductos(data);
    setFiltered(data);
  };

  const buscar = (term) => {
    setSearch(term);

    if (term.trim() === "") {
      setFiltered(productos);
      return;
    }

    const results = productos.filter((p) =>
      p.nombre_producto.toLowerCase().includes(term.toLowerCase())
    );

    setFiltered(results);
    setPage(1);
  };

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const eliminarProducto = async (id) => {
    if (!confirm("¿Eliminar este producto?")) return;

    const res = await fetch(`/api/productos/${id}`, { method: "DELETE" });
    const data = await res.json();

    if (data.ok) cargarProductos();
    else alert(data.error);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gestor de Productos</h2>

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
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr className="text-center">
              <th className="px-3 py-2 border">ID</th>
              <th className="px-3 py-2 border">Producto</th>
              <th className="px-3 py-2 border">Precio</th>
              <th className="px-3 py-2 border">Tipo</th>
              <th className="px-3 py-2 border">Marca</th>
              <th className="px-3 py-2 border">Proveedor</th>
              <th className="px-3 py-2 border">Stock</th>
              <th className="px-3 py-2 border">Caducidad</th>
              <th className="px-3 py-2 border">Rack</th>
              <th className="px-3 py-2 border">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((p) => (
              <tr key={p.id_producto} className="text-center">
                <td className="p-2 border">{p.id_producto}</td>
                <td className="p-2 border">{p.nombre_producto}</td>
                <td className="p-2 border">${p.precio}</td>
                <td className="p-2 border">{p.nombre_tipo}</td>
                <td className="p-2 border">{p.nombre_marca}</td>
                <td className="p-2 border">{p.nombre_proovedor}</td>
                <td className="p-2 border">{p.stock}</td>
                <td className="p-2 border">{p.fecha_caducidad}</td>
                <td className="p-2 border">{p.no_rack}</td>

                <td className="p-2 border space-x-2">
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                    onClick={() => {
                      setSelected(p);
                      setOpenEdit(true);
                    }}
                  >
                    Editar
                  </button>

                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded"
                    onClick={() => eliminarProducto(p.id_producto)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

            {paginated.length === 0 && (
              <tr>
                <td colSpan="10" className="p-4 text-gray-500">
                  No se encontraron productos.
                </td>
              </tr>
            )}
          </tbody>
        </table>

      </div>

      <div className="flex justify-center mt-4 space-x-2">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}
          className="px-4 py-1 bg-gray-300 rounded">Anterior</button>

        <span className="px-4 py-1 bg-gray-200 rounded">
          Página {page} de {totalPages}
        </span>

        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}
          className="px-4 py-1 bg-gray-300 rounded">Siguiente</button>
      </div>


      <ModalAgregarProducto
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSuccess={cargarProductos}
      />

      <ModalEditarProducto
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        producto={selected}
        onSuccess={cargarProductos}
      />
    </div>
  );
}

