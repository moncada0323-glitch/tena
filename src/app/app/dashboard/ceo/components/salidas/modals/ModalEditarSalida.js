"use client";

import { useState, useEffect } from "react";

export default function ModalEditarSalida({ open, onClose, onSuccess, salida }) {
  if (!open || !salida) return null;

  const [form, setForm] = useState({
    nombre_cliente: "",
    nombre_producto: "",
    nombre_responsable: "",
    no_empleado: "",
    cantidad: "",
    fecha_salida: "",
    hora_salida: "",
  });

  useEffect(() => {
    setForm({
      nombre_cliente: salida.nombre_cliente || "",
      nombre_producto: salida.nombre_producto || "",
      nombre_responsable: salida.nombre_responsable || "",
      no_empleado: salida.no_empleado || "",
      cantidad: salida.cantidad || "",
      fecha_salida: salida.fecha_salida || "",
      hora_salida: salida.hora_salida || "",
    });
  }, [salida]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const actualizarSalida = async () => {
    const res = await fetch(`/api/salidas/${salida.id_salida}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      onSuccess();
      onClose();
    } else {
      alert("Error al actualizar la salida");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6">

        <h2 className="text-xl font-bold mb-4">Editar Salida</h2>

        <div className="grid grid-cols-2 gap-4">

          <input
            type="text"
            name="nombre_cliente"
            placeholder="Cliente"
            className="border p-2 rounded"
            value={form.nombre_cliente}
            onChange={handleChange}
          />

          <input
            type="text"
            name="nombre_producto"
            placeholder="Producto"
            className="border p-2 rounded"
            value={form.nombre_producto}
            onChange={handleChange}
          />

          <input
            type="text"
            name="nombre_responsable"
            placeholder="Responsable"
            className="border p-2 rounded"
            value={form.nombre_responsable}
            onChange={handleChange}
          />

          <input
            type="number"
            name="no_empleado"
            placeholder="No. Empleado"
            className="border p-2 rounded"
            value={form.no_empleado}
            onChange={handleChange}
          />

          <input
            type="number"
            name="cantidad"
            placeholder="Cantidad"
            className="border p-2 rounded"
            value={form.cantidad}
            onChange={handleChange}
          />

          <input
            type="date"
            name="fecha_salida"
            className="border p-2 rounded"
            value={form.fecha_salida}
            onChange={handleChange}
          />

          <input
            type="time"
            name="hora_salida"
            className="border p-2 rounded"
            step="1"
            value={form.hora_salida}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end mt-6 space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancelar
          </button>

          <button
            onClick={actualizarSalida}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}
