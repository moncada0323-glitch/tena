"use client";
import { useState, useEffect } from "react";

export default function ModalEditarUsuario({ open, usuario, onClose, onSuccess }) {
  const [form, setForm] = useState({ no_empleado: "", contraseña: "" });

  useEffect(() => {
    if (open && usuario) {
      setForm({ no_empleado: usuario.no_empleado, contraseña: usuario.contraseña });
    }
  }, [open, usuario]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    if (!usuario) return;

    try {
      const res = await fetch(`/api/usuarios/${usuario.no_empleado}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();

      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        alert(data.error || "Error al actualizar usuario");
      }
    } catch (err) {
      console.error(err);
      alert("Error al actualizar usuario");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-[400px] shadow-lg">
        <h2 className="text-xl font-bold mb-4">Editar Usuario</h2>

        <input
          name="no_empleado"
          value={form.no_empleado}
          disabled
          className="input mb-2 w-full bg-gray-200 cursor-not-allowed"
        />

        <input
          name="contraseña"
          type="password"
          value={form.contraseña}
          onChange={change}
          placeholder="Contraseña"
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
