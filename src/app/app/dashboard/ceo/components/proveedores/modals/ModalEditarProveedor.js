"use client";
import { useState, useEffect } from "react";

export default function ModalEditarProveedor({ open, onClose, proveedor, onSuccess }) {
  const [form, setForm] = useState({
    nombre_proovedor: "",
    compania: "",
    telefono: "",
    correo: ""
  });

  useEffect(() => {
    if (open && proveedor) {
      setForm({
        nombre_proovedor: proveedor.nombre_proovedor || "",
        compania: proveedor.compania || "",
        telefono: proveedor.telefono || "",
        correo: proveedor.correo || ""
      });
    }
  }, [open, proveedor]);

  const change = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const submit = async () => {
    if (!proveedor) return;
    if (!form.nombre_proovedor || !form.compania) {
      alert("Nombre y Compañía son obligatorios");
      return;
    }

    try {
      const res = await fetch(`/api/proveedores/${proveedor.id_proovedor}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        alert(data.error || "Error al actualizar proveedor");
      }
    } catch (err) {
      console.error(err);
      alert("Error al actualizar proveedor");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-[400px] shadow-lg">
        <h2 className="text-xl font-bold mb-4">Editar Proveedor</h2>

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
          <button onClick={submit} className="bg-blue-600 text-white px-4 py-2 rounded">Guardar</button>
        </div>
      </div>
    </div>
  );
}
