"use client";
import { useState } from "react";

export default function ModalAgregarTipoProducto({ open, onClose, onSuccess }) {
  const [form, setForm] = useState({ nombre_tipo: "" });
  const [loading, setLoading] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    if (!form.nombre_tipo.trim()) {
      alert("El nombre del tipo es obligatorio");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/tipo_productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        alert(data.error || "Error al agregar tipo");
      }
    } catch (err) {
      console.error(err);
      alert("Error al agregar tipo");
    }
    setLoading(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-[350px] shadow-lg">
        <h2 className="text-xl font-bold mb-4">Agregar Tipo de Producto</h2>

        <input
          name="nombre_tipo"
          value={form.nombre_tipo}
          onChange={change}
          placeholder="Nombre del tipo"
          className="input mb-4 w-full"
        />

        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">Cancelar</button>
          <button onClick={submit} className="bg-green-600 text-white px-4 py-2 rounded">
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
