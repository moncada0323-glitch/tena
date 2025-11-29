"use client";
import { useState, useEffect } from "react";

export default function ModalAgregarProveedor({ open, onClose, onSuccess }) {
  const [form, setForm] = useState({
    nombre_proovedor: "",
    compania: "",
    telefono: "",
    correo: ""
  });

  const [loading, setLoading] = useState(false);

  const change = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const submit = async () => {
    if (!form.nombre_proovedor || !form.compania) {
      alert("Nombre y Compañía son obligatorios");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/proveedores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        alert(data.error || "Error al agregar proveedor");
      }
    } catch (err) {
      console.error(err);
      alert("Error al agregar proveedor");
    }
    setLoading(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-[400px] shadow-lg">
        <h2 className="text-xl font-bold mb-4">Agregar Proveedor</h2>

        <input
          name="nombre_proovedor"
          value={form.nombre_proovedor}
          onChange={change}
          placeholder="Nombre"
          className="input mb-2 w-full"
        />
        <input
          name="compania"
          value={form.compania}
          onChange={change}
          placeholder="Compañía"
          className="input mb-2 w-full"
        />
        <input
          name="telefono"
          value={form.telefono}
          onChange={change}
          placeholder="Teléfono"
          className="input mb-2 w-full"
        />
        <input
          name="correo"
          value={form.correo}
          onChange={change}
          placeholder="Correo"
          className="input mb-2 w-full"
        />

        <div className="flex justify-end space-x-2 mt-4">
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">Cancelar</button>
          <button onClick={submit} disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded">
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
