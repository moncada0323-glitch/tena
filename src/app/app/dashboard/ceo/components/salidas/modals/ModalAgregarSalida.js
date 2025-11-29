"use client";

import { useState } from "react";

export default function ModalAgregarSalida({ open, onClose, onSuccess }) {
  if (!open) return null;

  const [form, setForm] = useState({
    nombre_cliente: "",
    nombre_producto: "",
    nombre_responsable: "",
    no_empleado: "",
    cantidad: "",
    fecha_salida: "",
    hora_salida: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const guardarSalida = async () => {
    if (
      !form.nombre_cliente ||
      !form.nombre_producto ||
      !form.nombre_responsable ||
      !form.no_empleado ||
      !form.cantidad ||
      !form.fecha_salida ||
      !form.hora_salida
    ) {
      alert("Por favor llena todos los campos");
      return;
    }

    const res = await fetch("/api/salidas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      onSuccess();
      onClose();
    } else {
      alert("Error al guardar la salida");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6">

        <h2 className="text-xl font-bold mb-4">Agregar Salida</h2>

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
            value={form.hora_salida}
            step="1"
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
            onClick={guardarSalida}
            className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
