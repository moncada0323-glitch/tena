"use client";
import { useState, useEffect } from "react";

export default function ModalAgregarEmpleado({ open, onClose, onSuccess }) {
  const [form, setForm] = useState({
    no_empleado: "",
    nombre: "",
    apellido: "",
    telefono: "",
    direccion: "",
    puesto: "",
    turno: "",
    area: ""
  });

  const [puestos, setPuestos] = useState([]);
  const [areas, setAreas] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) cargarCatalogos();
  }, [open]);

  const cargarCatalogos = async () => {
    const resP = await fetch("/api/puestos");
    const resA = await fetch("/api/areas");
    const resT = await fetch("/api/turnos");

    setPuestos(await resP.json());
    setAreas(await resA.json());
    setTurnos(await resT.json());
  };

  const change = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value.toUpperCase(),
    });
  };

  const changeNormal = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = async () => {
    if (
      !form.no_empleado ||
      !form.nombre ||
      !form.apellido ||
      !form.puesto ||
      !form.turno ||
      !form.area
    ) {
      alert("FALTAN CAMPOS OBLIGATORIOS");
      return;
    }

    if (isNaN(Number(form.no_empleado))) {
      alert("EL NO_EMPLEADO DEBE SER NUMÉRICO");
      return;
    }

    setLoading(true);

    try {

      const resEmp = await fetch(`/api/empleados`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const empData = await resEmp.json();

      if (!resEmp.ok) {
        alert(empData.message);
        setLoading(false);
        return;
      }

      const resUser = await fetch(`/api/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          no_empleado: form.no_empleado,
          contraseña: "123456",
        }),
      });

      const userData = await resUser.json();

      if (!resUser.ok) {
        alert(userData.message);
        setLoading(false);
        return;
      }

      onSuccess();
      onClose();

    } catch (error) {
      console.error(error);
      alert("ERROR AL CREAR EMPLEADO");
    }

    setLoading(false);
  };

  if (!open) return null;

  return (
    <div className="modal fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-[450px] shadow-lg">
        <h2 className="text-xl font-bold mb-4">AGREGAR EMPLEADO</h2>

        <input
          name="no_empleado"
          onChange={changeNormal}
          value={form.no_empleado}
          placeholder="NO. EMPLEADO"
          className="input mb-2"
        />

        <input
          name="nombre"
          onChange={change}
          value={form.nombre}
          placeholder="NOMBRE"
          className="input mb-2"
        />

        <input
          name="apellido"
          onChange={change}
          value={form.apellido}
          placeholder="APELLIDO"
          className="input mb-2"
        />

        <input
          name="telefono"
          onChange={changeNormal}
          value={form.telefono}
          placeholder="TELEFONO"
          className="input mb-2"
        />

        <input
          name="direccion"
          onChange={change}
          value={form.direccion}
          placeholder="DIRECCION"
          className="input mb-2"
        />

        <select name="puesto" value={form.puesto} onChange={changeNormal} className="input mb-2">
          <option value="">SELECCIONAR PUESTO</option>
          {puestos.map((p) => <option key={p.id_puesto} value={p.id_puesto}>{p.nombre_puesto}</option>)}
        </select>

        <select name="area" value={form.area} onChange={changeNormal} className="input mb-2">
          <option value="">SELECCIONAR AREA</option>
          {areas.map((a) => <option key={a.id_area} value={a.id_area}>{a.nombre_area}</option>)}
        </select>

        <select name="turno" value={form.turno} onChange={changeNormal} className="input mb-2">
          <option value="">SELECCIONAR TURNO</option>
          {turnos.map((t) => <option key={t.id_turno} value={t.id_turno}>{t.nombre_turno}</option>)}
        </select>

        <div className="flex justify-end space-x-2 mt-4">
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">CANCELAR</button>
          <button onClick={submit} disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded">
            {loading ? "GUARDANDO..." : "GUARDAR"}
          </button>
        </div>
      </div>
    </div>
  );
}
