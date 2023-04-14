import Temperature from "./components/Temperature"
import Pie from "./components/Pie"

export default function App() {
  return (
    <div className="w-full h-full min-h-screen flex items-center bg-gradient-to-l from-sky-500 to-emerald-500 py-10">
      <div className="container grid gap-8">
        <p className="text-4xl font-chivo-mono">Dashboard en tiempo real</p>

        <div className="grid grid-cols-2 gap-6 font-chivo-mono">
          <div className="backdrop-blur-lg bg-white/30 rounded shadow-2xl basis-1/4 p-6 grid justify-items-center">
            <p className="text-lg">Temperatura Externa</p>
            <Temperature temp={20} />
          </div>
          <div className="backdrop-blur-lg bg-white/30 rounded shadow-2xl basis-1/4 p-6 grid justify-items-center">
            <p className="text-lg">Temperatura Interna</p>
            <Temperature temp={35} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 font-chivo-mono">
          <div className="backdrop-blur-lg bg-white/30 rounded shadow-2xl basis-1/4 p-6 grid justify-items-center">
            <p className="text-lg">Humedad</p>
            <Pie percentage={50} />
          </div>
          <div className="backdrop-blur-lg bg-white/30 rounded shadow-2xl basis-1/4 p-6 grid justify-items-center">
            <p className="text-lg">Porcentaje de Agua</p>
            <Pie percentage={75} />
          </div>
        </div>

      </div>
    </div>
  )
}