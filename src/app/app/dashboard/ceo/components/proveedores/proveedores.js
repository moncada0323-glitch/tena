"use client";
import { useEffect, useState } from "react";
import ModalAgregarProveedor from "./modals/ModalAgregarProveedor";
import ModalEditarProveedor from "./modals/ModalEditarProveedor";

export default function Proveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    cargarProveedores();
  }, []);

  const cargarProveedores = async () => {
    const res = await fetch("/api/proveedores");
    const data = await res.json();
    const sorted = data.sort((a, b) => b.id_proovedor - a.id_proovedor);
    setProveedores(sorted);
    setFiltered(sorted);
  };

  const buscar = (term) => {
    setSearch(term);
    if (!term.trim()) { setFiltered(proveedores); setPage(1); return; }
    const results = proveedores.filter(p =>
      p.nombre_proovedor.toLowerCase().includes(term.toLowerCase()) ||
      p.compania.toLowerCase().includes(term.toLowerCase())
    );
    setFiltered(results); setPage(1);
  };

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page-1)*perPage, page*perPage);

  const eliminar = async (id) => {
    if(!confirm("¿Eliminar este proveedor?")) return;
    const res = await fetch(`/api/proveedores/${id}`, { method: "DELETE" });
    const data = await res.json();
    if(data.ok || data.message) cargarProveedores(); else alert(data.error);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gestor de Proveedores</h2>
      <div className="flex justify-between mb-4">
        <input
          type="text"
          value={search}
          onChange={(e)=>buscar(e.target.value)}
          placeholder="Buscar proveedor..."
          className="border p-2 rounded w-60"
        />
        <button onClick={()=>setOpenAdd(true)} className="bg-green-600 text-white px-4 py-2 rounded">+ Agregar</button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr className="text-center">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Nombre</th>
              <th className="p-2 border">Compañía</th>
              <th className="p-2 border">Teléfono</th>
              <th className="p-2 border">Correo</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(p=>(
              <tr key={p.id_proovedor} className="text-center">
                <td className="p-2 border">{p.id_proovedor}</td>
                <td className="p-2 border">{p.nombre_proovedor}</td>
                <td className="p-2 border">{p.compania}</td>
                <td className="p-2 border">{p.telefono}</td>
                <td className="p-2 border">{p.correo}</td>
                <td className="p-2 border space-x-2">
                  <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={()=>{setSelected(p); setOpenEdit(true)}}>Editar</button>
                  <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={()=>eliminar(p.id_proovedor)}>Eliminar</button>
                </td>
              </tr>
            ))}
            {paginated.length===0 && <tr><td colSpan="6" className="p-4 text-gray-500">No se encontraron proveedores.</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4 space-x-2">
        <button disabled={page===1} onClick={()=>setPage(page-1)} className="px-4 py-1 bg-gray-300 rounded">Anterior</button>
        <span className="px-4 py-1 bg-gray-200 rounded">Página {page} de {totalPages}</span>
        <button disabled={page===totalPages||totalPages===0} onClick={()=>setPage(page+1)} className="px-4 py-1 bg-gray-300 rounded">Siguiente</button>
      </div>

      <ModalAgregarProveedor open={openAdd} onClose={()=>setOpenAdd(false)} onSuccess={cargarProveedores}/>
      <ModalEditarProveedor open={openEdit} onClose={()=>setOpenEdit(false)} proveedor={selected} onSuccess={cargarProveedores}/>
    </div>
  );
}
