"use client";
import { useState, useEffect } from "react";

export default function ModalEditarEmpleado({
  open,
  empleadoEdit,
  onClose,
  onSuccess,
}) {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    direccion: "",
    puesto: "",
    area: "",
    turno: "",
  });

  const [puestos, setPuestos] = useState([]);
  const [areas, setAreas] = useState([]);
  const [turnos, setTurnos] = useState([]);

  const [loading, setLoading] = useState(false);

  const cargarCatalogos = async () => {
    try {
      const [p, a, t] = await Promise.all([
        fetch("/api/puestos"),
        fetch("/api/areas"),
        fetch("/api/turnos"),
      ]);

      setPuestos(await p.json());
      setAreas(await a.json());
      setTurnos(await t.json());
    } catch (err) {
      console.error("Error cargando catálogos:", err);
    }
  };

  useEffect(() => {
    cargarCatalogos();
  }, []);

  const obtenerID = (lista, nombre) => {
    if (!lista.length || !nombre) return "";
    const match = lista.find(
      (i) =>
        (i.nombre_puesto?.toUpperCase() === nombre.toUpperCase()) ||
        (i.nombre_area?.toUpperCase() === nombre.toUpperCase()) ||
        (i.nombre_turno?.toUpperCase() === nombre.toUpperCase())
    );
    return match
      ? match.id_puesto || match.id_area || match.id_turno
      : "";
  };

  useEffect(() => {
    if (!open || !empleadoEdit) return;

    setForm({
      nombre: empleadoEdit.nombre || "",
      apellido: empleadoEdit.apellido || "",
      telefono: empleadoEdit.telefono || "",
      direccion: empleadoEdit.direccion || "",

      puesto: obtenerID(puestos, empleadoEdit.puesto),
      area: obtenerID(areas, empleadoEdit.area),
      turno: obtenerID(turnos, empleadoEdit.turno),
    });
  }, [open, empleadoEdit, puestos, areas, turnos]);

  const changeUpper = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value.toUpperCase() });

  const changeNormal = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validar = () => {
    if (!form.nombre.trim()) return "El nombre es obligatorio";
    if (!form.apellido.trim()) return "El apellido es obligatorio";
    if (!form.puesto) return "Selecciona un puesto";
    if (!form.area) return "Selecciona un área";
    if (!form.turno) return "Selecciona un turno";
    return null;
  };

  const submit = async () => {
    const error = validar();
    if (error) {
      alert(error);
      return;
    }

    setLoading(true);

    const res = await fetch(`/api/empleados/${empleadoEdit.no_empleado}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(data.message || "Error al actualizar empleado");
      return;
    }

    onSuccess();
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-[450px] shadow-lg">
        <h2 className="text-xl font-bold mb-4">EDITAR EMPLEADO</h2>

        <input
          name="nombre"
          value={form.nombre}
          onChange={changeUpper}
          placeholder="NOMBRE"
          className="input mb-2"
        />

        <input
          name="apellido"
          value={form.apellido}
          onChange={changeUpper}
          placeholder="APELLIDO"
          className="input mb-2"
        />

        <input
          name="telefono"
          value={form.telefono}
          onChange={changeNormal}
          placeholder="TELÉFONO"
          className="input mb-2"
        />

        <input
          name="direccion"
          value={form.direccion}
          onChange={changeUpper}
          placeholder="DIRECCIÓN"
          className="input mb-2"
        />

        <select
          name="puesto"
          value={form.puesto}
          onChange={changeNormal}
          className="input mb-2"
        >
          <option value="">SELECCIONAR PUESTO</option>
          {puestos.map((p) => (
            <option key={p.id_puesto} value={p.id_puesto}>
              {p.nombre_puesto}
            </option>
          ))}
        </select>

        <select
          name="area"
          value={form.area}
          onChange={changeNormal}
          className="input mb-2"
        >
          <option value="">SELECCIONAR ÁREA</option>
          {areas.map((a) => (
            <option key={a.id_area} value={a.id_area}>
              {a.nombre_area}
            </option>
          ))}
        </select>

        <select
          name="turno"
          value={form.turno}
          onChange={changeNormal}
          className="input mb-2"
        >
          <option value="">SELECCIONAR TURNO</option>
          {turnos.map((t) => (
            <option key={t.id_turno} value={t.id_turno}>
              {t.nombre_turno}
            </option>
          ))}
        </select>

        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            CANCELAR
          </button>

          <button
            onClick={submit}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {loading ? "GUARDANDO..." : "GUARDAR"}
          </button>
        </div>
      </div>
    </div>
  );
}
