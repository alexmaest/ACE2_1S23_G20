import SimpleGraphic from './components/SimpleGraphic'
import { useEffect, useState } from 'react'
import { getHumidity } from './services/useReports'

function humedadRelativaPage() {
  const [dataHumedadRelativa, setDataHumedadRelativa] = useState([])

  useEffect(() => {
    getHumidity().then((data) => {
      setDataHumedadRelativa(data)
    })
  }, [])

  return (
    <>
      <div className="flex p-2 bg-gray-900">
        <h1 className="text font-semibold text-center text-white">
          Grupo 20 ACE2 - Humedad Relativa
        </h1>
      </div>
      <div className="flex justify-center mt-10">
        <div className=" bg-gray-900 rounded-lg ring-2 ring-indigo-500 drop-shadow-2xl">
          {dataHumedadRelativa.length > 0 && (
            <SimpleGraphic
              title="Humedad relativa a lo largo del tiempo"
              xLabel="datos obtenidos"
              yLabel="porcentaje %"
              dias={dataHumedadRelativa.length}
              grados={dataHumedadRelativa}
            />
          )}
        </div>
      </div>
    </>
  )
}

export default humedadRelativaPage
