"use client";
import { useState, useEffect } from "react";

export default function ModalEditarRack({ open, onClose, rack, onSuccess }) {
  const [form, setForm] = useState({ no_rack: "" });

  useEffect(() => {
    if (open && rack) {
      setForm({ no_rack: rack.no_rack });
    }
  }, [open, rack]);

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    if (!rack) return;
    if (!form.no_rack) {
      alert("Número de Rack es obligatorio");
      return;
    }

    try {
      const res = await fetch(`/api/racks/${rack.id_rack}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        alert(data.error || "Error al actualizar rack");
      }
    } catch (err) {
      console.error(err);
      alert("Error al actualizar rack");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-[300px] shadow-lg">
        <h2 className="text-xl font-bold mb-4">Editar Rack</h2>

        <input
          name="no_rack"
          value={form.no_rack}
          onChange={change}
          placeholder="Número de Rack"
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
