"use client";
import { useState, useEffect } from "react";

export default function ModalAgregarEntrada({ open, onClose, onSuccess }) {
  const [form, setForm] = useState({
    id_proovedor: "",
    id_producto: "",
    nombre_responsable: "",
    no_empleado: "",
    cantidad: "",
    fecha_entrega: "",
    hora_entrega: "",
  });

  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    if (open) cargarCatalogos();
  }, [open]);

  const cargarCatalogos = async () => {
    const resP = await fetch("/api/proveedores");
    const resPr = await fetch("/api/productos");

    setProveedores(await resP.json());
    setProductos(await resPr.json());
  };

  const change = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = async () => {
    const res = await fetch("/api/entradas", {
      method: "POST",
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    onSuccess();
    onClose();
  };

  if (!open) return null;

  return (
    <div className="modal fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-[420px] shadow-lg">
        <h2 className="text-xl font-bold mb-4">Agregar Entrada</h2>

        <select
          name="id_proovedor"
          value={form.id_proovedor}
          onChange={change}
          className="input mb-2 w-full"
        >
          <option value="">Seleccionar Proveedor</option>
          {proveedores.map((p) => (
            <option value={p.id_proovedor} key={p.id_proovedor}>
              {p.nombre_proovedor}
            </option>
          ))}
        </select>

        <select
          name="id_producto"
          value={form.id_producto}
          onChange={change}
          className="input mb-2 w-full"
        >
          <option value="">Seleccionar Producto</option>
          {productos.map((p) => (
            <option value={p.id_producto} key={p.id_producto}>
              {p.nombre_producto}
            </option>
          ))}
        </select>

        <input
          name="nombre_responsable"
          className="input mb-2 w-full"
          placeholder="Nombre responsable"
          value={form.nombre_responsable}
          onChange={change}
        />

        <input
          name="no_empleado"
          className="input mb-2 w-full"
          placeholder="No empleado"
          value={form.no_empleado}
          onChange={change}
        />

        <input
          type="number"
          name="cantidad"
          className="input mb-2 w-full"
          placeholder="Cantidad"
          value={form.cantidad}
          onChange={change}
        />

        <input
          type="date"
          name="fecha_entrega"
          className="input mb-2 w-full"
          value={form.fecha_entrega}
          onChange={change}
        />

        <input
          type="time"
          name="hora_entrega"
          className="input mb-2 w-full"
          value={form.hora_entrega}
          onChange={change}
        />

        <div className="flex justify-end space-x-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded">
            Cancelar
          </button>

          <button onClick={submit} className="px-4 py-2 bg-green-600 text-white rounded">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
