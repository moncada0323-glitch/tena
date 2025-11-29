"use client";
import { useState, useEffect } from "react";

export default function ModalAgregarProducto({ open, onClose, onSuccess }) {
  const [form, setForm] = useState({
    nombre_producto: "",
    precio: "",
    id_tipo: "",
    id_marca: "",
    id_proovedor: "",
    stock: "",
    fecha_caducidad: "",
    id_rack: ""
  });

  const [tipos, setTipos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [racks, setRacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCatalogos, setLoadingCatalogos] = useState(false);

  useEffect(() => {
    if (open) cargarCatalogos();
  }, [open]);

  const cargarCatalogos = async () => {
    try {
      setLoadingCatalogos(true);
      const [resT, resM, resP, resR] = await Promise.all([
        fetch("/api/tipo_productos"),
        fetch("/api/marcas"),
        fetch("/api/proveedores"),
        fetch("/api/racks")
      ]);
      setTipos(await resT.json());
      setMarcas(await resM.json());
      setProveedores(await resP.json());
      setRacks(await resR.json());
    } catch (error) {
      console.error("Error cargando catálogos:", error);
      alert("No se pudieron cargar los catálogos. Intenta nuevamente.");
    } finally {
      setLoadingCatalogos(false);
    }
  };

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    if (!form.nombre_producto || !form.id_tipo || !form.id_marca || !form.id_proovedor || !form.id_rack) {
      alert("Faltan campos obligatorios");
      return;
    }

    setLoading(true);
    try {
     
      const res = await fetch("/api/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre_producto: form.nombre_producto,
          precio: form.precio || 0,
          id_tipo: form.id_tipo,
          id_marca: form.id_marca,
          id_proovedor:form.id_proovedor,
          stock:form.stock || 0,
          fecha_caducidad: form.fecha_caducidad || null,
          id_rack:form.id_rack
        
        })
      });
      

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Error al agregar producto");
      } else {
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error(err);
      alert("Error al agregar producto");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="modal fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-[500px] shadow-lg">
        <h2 className="text-xl font-bold mb-4">AGREGAR PRODUCTO</h2>

        <input
          name="nombre_producto"
          value={form.nombre_producto}
          onChange={change}
          placeholder="Nombre producto"
          className="input mb-2 w-full"
        />

        <input
          name="precio"
          type="number"
          value={form.precio}
          onChange={change}
          placeholder="Precio"
          className="input mb-2 w-full"
        />

        <select name="id_tipo" value={form.id_tipo} onChange={change} className="input mb-2 w-full" disabled={loadingCatalogos}>
          <option value="">Seleccionar tipo</option>
          {tipos.map(t => <option key={t.id_tipo} value={t.id_tipo}>{t.nombre_tipo}</option>)}
        </select>

        <select name="id_marca" value={form.id_marca} onChange={change} className="input mb-2 w-full" disabled={loadingCatalogos}>
          <option value="">Seleccionar marca</option>
          {marcas.map(m => <option key={m.id_marca} value={m.id_marca}>{m.nombre_marca}</option>)}
        </select>

        <select name="id_proovedor" value={form.id_proovedor} onChange={change} className="input mb-2 w-full" disabled={loadingCatalogos}>
          <option value="">Seleccionar proveedor</option>
          {proveedores.map(p => <option key={p.id_proovedor} value={p.id_proovedor}>{p.compania}</option>)}
        </select>

        <input
          name="stock"
          type="number"
          value={form.stock}
          onChange={change}
          placeholder="Stock"
          className="input mb-2 w-full"
        />

        <input
          name="fecha_caducidad"
          type="date"
          value={form.fecha_caducidad}
          onChange={change}
          className="input mb-2 w-full"
        />

        <select name="id_rack" value={form.id_rack} onChange={change} className="input mb-2 w-full" disabled={loadingCatalogos}>
          <option value="">Seleccionar rack</option>
          {racks.map(r => <option key={r.id_rack} value={r.id_rack}>{r.no_rack}</option>)}
        </select>

        <div className="flex justify-end mt-4 space-x-2">
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">Cancelar</button>
          <button onClick={submit} disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded">
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
