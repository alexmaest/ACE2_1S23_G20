import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";
import axios from "../api/axios";

import Temperature from "./Temperature";
import Pie from "./Pie";

const GET_REAL_TIME_DATA = "/api/realTimeData";

function Dashboard() {
  const [externalTemperature, setExternalTemperature] = useState(0);
  const [internalTemperature, setInternalTemperature] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [waterPercentage, setWaterPercentage] = useState(0);
  const navigate = useNavigate();

  const getRealTimeData = async () => {
    try {
      let result = await axios.get(GET_REAL_TIME_DATA);
      var data = result.data.realTimeData[0]
      console.log("+++++++++++++++++++++++++++++++++++++++++++++")
      console.log(data);
      setExternalTemperature(data.TempE);
      setInternalTemperature(data.TempI);
      setHumidity(data.Hume);
      setWaterPercentage(data.PAgua);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getRealTimeData();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    socket.connect();
    socket.on("externalTemperature", (data) => {
      setExternalTemperature(data);
    });
    socket.on("internalTemperature", (data) => {
      setInternalTemperature(data);
    });
    socket.on("soilMoisture", (data) => {
      setHumidity(data);
    });
    socket.on("waterLevel", (data) => {
      setWaterPercentage(data);
    });
    return () => {
      socket.off("externalTemperature");
      socket.off("internalTemperature");
      socket.off("soilMoisture");
      socket.off("waterLevel");
      socket.disconnect();
    }
  }, []);

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
            <Temperature temp={externalTemperature} />
            <button
              className="rounded-full bg-green-400 hover:hover:brightness-105 px-8 py-2 "
              onClick={() => navigate("/external-temperature")}
            >Ver Gráfica</button>
          </div>
          <div className="backdrop-blur-lg bg-white/30 rounded shadow-2xl basis-1/4 p-6 grid justify-items-center">
            <p className="text-lg">Temperatura Interna</p>
            <Temperature temp={internalTemperature} />
            <button
              className="rounded-full bg-green-400 hover:hover:brightness-105 px-8 py-2 "
              onClick={() => navigate("/internal-temperature")}
            >Ver Gráfica</button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 font-chivo-mono">
          <div className="backdrop-blur-lg bg-white/30 rounded shadow-2xl basis-1/4 p-6 grid justify-items-center">
            <p className="text-lg">Humedad de Tierra</p>
            <Pie percentage={humidity} />
            <button
              className="rounded-full bg-green-400 hover:hover:brightness-105 px-8 py-2 "
              onClick={() => navigate("/humidity")}
            >Ver Gráfica</button>
          </div>
          <div className="backdrop-blur-lg bg-white/30 rounded shadow-2xl basis-1/4 p-6 grid justify-items-center">
            <p className="text-lg">Porcentaje de Agua</p>
            <Pie percentage={waterPercentage} />
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