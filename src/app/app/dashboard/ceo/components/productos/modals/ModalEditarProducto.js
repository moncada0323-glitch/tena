"use client";
import { useState, useEffect } from "react";

export default function ModalEditarProducto({ open, onClose, producto, onSuccess }) {
  const [form, setForm] = useState({
    nombre_producto: "",
    precio: "",
    tipo: "",
    marca: "",
    proovedor: "",
    stock: "",
    fecha_caducidad: "",
    no_rack: ""
  });

  const [tipos, setTipos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [racks, setRacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCatalogos, setLoadingCatalogos] = useState(false);

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
    } catch (err) {
      console.error("Error cargando catálogos:", err);
      alert("No se pudieron cargar los catálogos");
    } finally {
      setLoadingCatalogos(false);
    }
  };

  const obtenerID = (lista, nombre, campoNombre, campoID) => {
    if (!lista.length || !nombre) return "";
    const match = lista.find((i) => i[campoNombre] === nombre);
    return match ? match[campoID].toString() : "";
  };

  useEffect(() => {
    if (open) cargarCatalogos();
  }, [open]);
  
  useEffect(() => {
    if (producto && tipos.length && marcas.length && proveedores.length && racks.length) {
      setForm({
        nombre_producto: producto.nombre_producto || "",
        precio: producto.precio || "",
        tipo: obtenerID(tipos, producto.tipo, "nombre_tipo", "id_tipo"),
        marca: obtenerID(marcas, producto.marca, "nombre_marca", "id_marca"),
        proovedor: obtenerID(proveedores, producto.proovedor, "nombre_proovedor", "id_proovedor"),
        stock: producto.stock || "",
        fecha_caducidad: producto.fecha_caducidad?.split("T")[0] || "",
        no_rack: obtenerID(racks, producto.no_rack, "no_rack", "id_rack")
      });
    }
  }, [producto, tipos, marcas, proveedores, racks]);

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    if (!form.nombre_producto || !form.tipo || !form.marca || !form.proovedor || !form.no_rack) {
      alert("Faltan campos obligatorios");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/productos/${producto.id_producto}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre_producto: form.nombre_producto,
          precio: parseFloat(form.precio) || 0,
          tipo: parseInt(form.tipo),
          marca: parseInt(form.marca),
          proovedor: parseInt(form.proovedor),
          stock: parseInt(form.stock) || 0,
          fecha_caducidad: form.fecha_caducidad,
          no_rack: parseInt(form.no_rack)
        })
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Error al actualizar producto");
      } else {
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error(err);
      alert("Error al actualizar producto");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="modal fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-[500px] shadow-lg">
        <h2 className="text-xl font-bold mb-4">EDITAR PRODUCTO</h2>

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

        <select
          name="tipo"
          value={form.tipo}
          onChange={change}
          className="input mb-2 w-full"
          disabled={loadingCatalogos}
        >
          <option value="">Seleccionar tipo</option>
          {tipos.map((t) => (
            <option key={t.id_tipo} value={t.id_tipo}>{t.nombre_tipo}</option>
          ))}
        </select>

        <select
          name="marca"
          value={form.marca}
          onChange={change}
          className="input mb-2 w-full"
          disabled={loadingCatalogos}
        >
          <option value="">Seleccionar marca</option>
          {marcas.map((m) => (
            <option key={m.id_marca} value={m.id_marca}>{m.nombre_marca}</option>
          ))}
        </select>

        <select
          name="proovedor"
          value={form.proovedor}
          onChange={change}
          className="input mb-2 w-full"
          disabled={loadingCatalogos}
        >
          <option value="">Seleccionar proveedor</option>
          {proveedores.map((p) => (
            <option key={p.id_proovedor} value={p.id_proovedor}>{p.nombre_proovedor}</option>
          ))}
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

        <select
          name="no_rack"
          value={form.no_rack}
          onChange={change}
          className="input mb-2 w-full"
          disabled={loadingCatalogos}
        >
          <option value="">Seleccionar rack</option>
          {racks.map((r) => (
            <option key={r.id_rack} value={r.id_rack}>{r.no_rack}</option>
          ))}
        </select>

        <div className="flex justify-end mt-4 space-x-2">
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">
            Cancelar
          </button>
          <button onClick={submit} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
