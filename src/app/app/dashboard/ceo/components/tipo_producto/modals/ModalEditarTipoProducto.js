"use client";
import { useState, useEffect } from "react";

export default function ModalEditarTipoProducto({ open, tipo, onClose, onSuccess }) {
  const [form, setForm] = useState({ nombre_tipo: "" });

  useEffect(() => {
    if (open && tipo) {
      setForm({ nombre_tipo: tipo.nombre_tipo });
    }
  }, [open, tipo]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    if (!tipo) return;
    if (!form.nombre_tipo.trim()) {
      alert("El nombre del tipo es obligatorio");
      return;
    }

    try {
      const res = await fetch(`/api/tipo_productos/${tipo.id_tipo}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        alert(data.error || "Error al actualizar tipo");
      }
    } catch (err) {
      console.error(err);
      alert("Error al actualizar tipo");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-[350px] shadow-lg">
        <h2 className="text-xl font-bold mb-4">Editar Tipo de Producto</h2>

        <input
          name="nombre_tipo"
          value={form.nombre_tipo}
          onChange={change}
          placeholder="Nombre del tipo"
          className="input mb-4 w-full"
        />

        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">Cancelar</button>
          <button onClick={submit} className="bg-blue-600 text-white px-4 py-2 rounded">Guardar</button>
        </div>
      </div>
    </div>
  );
}
