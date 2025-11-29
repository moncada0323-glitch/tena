"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
    const [usuario, setUsuario] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ usuario, contrasena }),
            });

            const data = await res.json();

            if (!data.ok) {
                setError(data.message);
                return;
            }

            const area = data.user.area;
            const puesto = data.user.puesto;

            // --- RUTAS POR ÁREA ---
            if (area === "embarque") {
                if (puesto === "Gerente") {
                    router.push("/dashboard/embarque/gerente");
                } else if (puesto === "administrador") {
                    router.push("/dashboard/embarque/administrador");
                } else if (puesto === "operador") {
                    router.push("/dashboard/embarque/operador");
                }
            }

            else if (area === "CEO") {
                router.push("/dashboard/CEO");
            }

            else if (area === "oficina") {
                if (puesto === "Gerente") {
                    router.push("/dashboard/oficina/gerente");
                } else if (puesto === "administrador") {
                    router.push("/dashboard/oficina/administrador");
                } else if (puesto === "operador") {
                    router.push("/dashboard/oficina/operador");
                }
            }

            else if (area === "ventas") {
                if (puesto === "Gerente") {
                    router.push("/dashboard/ventas/gerente");
                } else if (puesto === "administrador") {
                    router.push("/dashboard/ventas/administrador");
                } else if (puesto === "operador") {
                    router.push("/dashboard/ventas/operador");
                }
            }

            else if (area === "compras") {
                if (puesto === "Gerente") {
                    router.push("/dashboard/compras/gerente");
                } else if (puesto === "administrador") {
                    router.push("/dashboard/compras/administrador");
                } else if (puesto === "operador") {
                    router.push("/dashboard/compras/operador");
                }
            }

            else if (area === "almacen") {
                if (puesto === "Gerente") {
                    router.push("/dashboard/almacen/gerente");
                } else if (puesto === "administrador") {
                    router.push("/dashboard/almacen/administrador");
                } else if (puesto === "operador") {
                    router.push("/dashboard/almacen/operador");
                }
            }

        } catch (err) {
            console.error(err);
            setError("Error al conectar con el servidor");
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gradient-to-t from-blue-500 via-purple-500 to-pink-500">
            <form
                onSubmit={handleSubmit}
                className="bg-black p-6 rounded-2xl shadow-md w-80 flex flex-col space-y-3"
            >
                <h2 className="text-xl font-bold text-center mb-3">Iniciar sesión</h2>

                <input
                    type="text"
                    placeholder="Usuario"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    className="border rounded-md p-2"
                />

                <input
                    type="password"
                    placeholder="Contraseña"
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                    className="border rounded-md p-2"
                />

                {error && (
                    <p className="text-red-500 text-sm">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
                >
                    Entrar
                </button>
            </form>
        </div>
    );
}
