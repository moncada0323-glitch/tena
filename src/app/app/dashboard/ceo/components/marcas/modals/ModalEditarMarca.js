"use client";
import { useEffect, useState } from "react";

export default function ModalEditarMarca({ open, onClose, marca, onSuccess }) {
  const [nombre_marca, setNombre] = useState("");

  useEffect(() => {
    if (open && marca) {
      setNombre(marca.nombre_marca);
    }
  }, [open, marca]);

  const submit = async () => {
    const res = await fetch(`/api/marcas/${marca.id_marca}`, {
      method: "PUT",
      body: JSON.stringify({ nombre_marca }),
    });

    const data = await res.json();

    if (data.ok) {
      onSuccess();
      onClose();
    } else {
      alert(data.error);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-[350px] shadow">
        <h2 className="text-xl font-bold mb-4">Editar Marca</h2>

        <input
          className="border w-full p-2 rounded mb-2"
          value={nombre_marca}
          onChange={(e) => setNombre(e.target.value.toUpperCase())}
        />

        <div className="flex justify-end space-x-2 mt-4">
          <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={onClose}>
            Cancelar
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={submit}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
