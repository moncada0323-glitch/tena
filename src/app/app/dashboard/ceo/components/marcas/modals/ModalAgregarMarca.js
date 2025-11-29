"use client";
import { useState } from "react";

export default function ModalAgregarMarca({ open, onClose, onSuccess }) {
  const [nombre_marca, setNombre] = useState("");

  const submit = async () => {
    const res = await fetch("/api/marcas", {
      method: "POST",
      body: JSON.stringify({ nombre_marca }),
    });

    const data = await res.json();

    if (data.ok) {
      onSuccess();
      onClose();
      setNombre("");
    } else {
      alert(data.error);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-[350px] shadow">
        <h2 className="text-xl font-bold mb-4">Agregar Marca</h2>

        <input
          className="border w-full p-2 rounded mb-2"
          placeholder="Nombre de la marca"
          value={nombre_marca}
          onChange={(e) => setNombre(e.target.value.toUpperCase())}
        />

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
