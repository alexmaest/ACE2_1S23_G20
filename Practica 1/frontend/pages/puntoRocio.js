import SimpleGraphic from './components/SimpleGraphic'
import { useEffect, useState } from 'react'
import { getDewPoint } from './services/useReports'

function puntoRocioPage() {
  const [dataDewPoint, setDataDewPoint] = useState([])

  useEffect(() => {
    getDewPoint().then((data) => {
      setDataDewPoint(data)
    })
  }, [])

  return (
    <>
      <div className="flex p-2 bg-gray-900">
        <h1 className="text font-semibold text-center text-white">
          Grupo 20 ACE2 - Punto de Rocío
        </h1>
      </div>
      <div className="flex justify-center mt-10">
        <div className=" bg-gray-900 rounded-lg ring-2 ring-indigo-500 drop-shadow-2xl">
          {dataDewPoint.length > 0 && (
            <SimpleGraphic
              title="Punto Rocío a lo largo del tiempo"
              xLabel="datos obtenidos"
              yLabel="Punto Rocío °C"
              dias={dataDewPoint.length}
              grados={dataDewPoint}
            />
          )}
        </div>
      </div>
    </>
  )
}

export default puntoRocioPage
