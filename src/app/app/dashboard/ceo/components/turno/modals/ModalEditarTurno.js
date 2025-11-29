"use client";
import { useState, useEffect } from "react";

export default function ModalEditarTurno({ open, turno, onClose, onSuccess }) {
  const [form, setForm] = useState({ nombre_turno: "", hora_entrada: "", hora_salida: "" });

  useEffect(() => {
    if (open && turno) {
      setForm({
        nombre_turno: turno.nombre_turno,
        hora_entrada: turno.hora_entrada,
        hora_salida: turno.hora_salida
      });
    }
  }, [open, turno]);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    if (!turno) return;
    if (!form.nombre_turno || !form.hora_entrada || !form.hora_salida) {
      alert("Todos los campos son obligatorios");
      return;
    }

    try {
      const res = await fetch(`/api/turnos/${turno.id_turno}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        alert(data.error || "Error al actualizar turno");
      }
    } catch (err) {
      console.error(err);
      alert("Error al actualizar turno");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-[400px] shadow-lg">
        <h2 className="text-xl font-bold mb-4">Editar Turno</h2>

        <input
          name="nombre_turno"
          value={form.nombre_turno}
          onChange={change}
          placeholder="Nombre del turno"
          className="input mb-2 w-full"
        />
        <input
          name="hora_entrada"
          type="time"
          value={form.hora_entrada}
          onChange={change}
          className="input mb-2 w-full"
        />
        <input
          name="hora_salida"
          type="time"
          value={form.hora_salida}
          onChange={change}
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
