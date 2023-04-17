import { Routes, Route } from "react-router-dom"

import Layout from "./components/Layout"
import Dashboard from "./components/Dashboard"
import Chart from "./components/Chart"

export default function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/external-temperature" element={<Chart name={"Temperatura Externa"} />} />
        <Route path="/internal-temperature" element={<Chart name={"Temperatura Interna"} />} />
        <Route path="/humidity" element={<Chart name={"Humedad de Tierra"} />} />
        <Route path="/water-percentage" element={<Chart name={"Porcentaje de Agua"} />} />
        <Route path="/pump-activation" element={<Chart name={"Periodo de Activación de la Bomba"} />} />
      </Route>
    </Routes>
  );
}