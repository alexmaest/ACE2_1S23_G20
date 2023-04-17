import { useNavigate } from "react-router-dom";

import Temperature from "./Temperature";
import Pie from "./Pie";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full min-h-screen flex items-center bg-gradient-to-l from-sky-500 to-emerald-500 py-10">
      <div className="container grid gap-8">
        <div className="flex justify-between font-chivo-mono">
          <p className="text-4xl">Dashboard en tiempo real</p>
          <button
            className="rounded-full bg-green-400 hover:hover:brightness-105 px-8 py-2 "
            onClick={() => navigate("/pump-activation")}
          >Ver Periodo de Activación de la Bomba</button>
        </div>

        <div className="grid grid-cols-2 gap-6 font-chivo-mono">
          <div className="backdrop-blur-lg bg-white/30 rounded shadow-2xl basis-1/4 p-6 grid justify-items-center">
            <p className="text-lg">Temperatura Externa</p>
            <Temperature temp={20} />
            <button
              className="rounded-full bg-green-400 hover:hover:brightness-105 px-8 py-2 "
              onClick={() => navigate("/external-temperature")}
            >Ver Gráfica</button>
          </div>
          <div className="backdrop-blur-lg bg-white/30 rounded shadow-2xl basis-1/4 p-6 grid justify-items-center">
            <p className="text-lg">Temperatura Interna</p>
            <Temperature temp={35} />
            <button
              className="rounded-full bg-green-400 hover:hover:brightness-105 px-8 py-2 "
              onClick={() => navigate("/internal-temperature")}
            >Ver Gráfica</button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 font-chivo-mono">
          <div className="backdrop-blur-lg bg-white/30 rounded shadow-2xl basis-1/4 p-6 grid justify-items-center">
            <p className="text-lg">Humedad de Tierra</p>
            <Pie percentage={50} />
            <button
              className="rounded-full bg-green-400 hover:hover:brightness-105 px-8 py-2 "
              onClick={() => navigate("/humidity")}
            >Ver Gráfica</button>
          </div>
          <div className="backdrop-blur-lg bg-white/30 rounded shadow-2xl basis-1/4 p-6 grid justify-items-center">
            <p className="text-lg">Porcentaje de Agua</p>
            <Pie percentage={75} />
            <button
              className="rounded-full bg-green-400 hover:hover:brightness-105 px-8 py-2 "
              onClick={() => navigate("/water-percentage")}
            >Ver Gráfica</button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard