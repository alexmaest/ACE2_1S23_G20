import SimpleGraphic from './components/SimpleGraphic'
import { useEffect, useState } from 'react'
import { getAbsHumidity } from './services/useReports'

function humedadAbsolutaPage() {
  const [dataAbsHumidity, setDataAbsHumidity] = useState([])

  useEffect(() => {
    getAbsHumidity().then((data) => {
      setDataAbsHumidity(data)
    })
  }, [])

  return (
    <>
      <div className="flex p-2 bg-gray-900">
        <h1 className="text font-semibold text-center text-white">
          Grupo 20 ACE2 - Humedad Absoluta
        </h1>
      </div>
      <div className="flex justify-center mt-10">
        <div className=" bg-gray-900 rounded-lg ring-2 ring-indigo-500 drop-shadow-2xl">
          {dataAbsHumidity.length > 0 && (
            <SimpleGraphic
              title="Humedad absoluta a lo largo del tiempo"
              xLabel="datos obtenidos"
              yLabel="humedad absoluta g/m³"
              dias={dataAbsHumidity.length}
              grados={dataAbsHumidity}
            />
          )}
        </div>
      </div>
    </>
  )
}

export default humedadAbsolutaPage
