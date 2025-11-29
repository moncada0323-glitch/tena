"use client";
import { useState } from "react";

export default function ModalAgregarCliente({ open, onClose, onSuccess }) {
  const [form, setForm] = useState({
    nombre_cliente: "",
    apellido: "",
    direccion: "",
    correo: "",
    telefono: "",
  });

  const change = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value.toUpperCase(),
    });
  };

  const submit = async () => {
    const res = await fetch("/api/clientes", {
      method: "POST",
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.ok) {
      onSuccess();
      onClose();
      setForm({
        nombre_cliente: "",
        apellido: "",
        direccion: "",
        correo: "",
        telefono: "",
      });
    } else {
      alert(data.error);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-[400px] shadow">
        <h2 className="text-xl font-bold mb-4">Agregar Cliente</h2>

        <input className="input mb-2" name="nombre_cliente" onChange={change} value={form.nombre_cliente} placeholder="Nombre" />
        <input className="input mb-2" name="apellido" onChange={change} value={form.apellido} placeholder="Apellido" />
        <input className="input mb-2" name="correo" onChange={change} value={form.correo} placeholder="Correo" />
        <input className="input mb-2" name="telefono" onChange={change} value={form.telefono} placeholder="Teléfono" />
        <input className="input mb-2" name="direccion" onChange={change} value={form.direccion} placeholder="Dirección" />

        <div className="flex justify-end space-x-2 mt-4">
          <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={onClose}>
            Cancelar
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={submit}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
