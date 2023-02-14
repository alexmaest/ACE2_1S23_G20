import SimpleGraphic from './components/SimpleGraphic'
import { useEffect, useState } from 'react'
import { getTemperature } from './services/useReports'
import Loader from './components/Loader'

function temperaturaPage() {
  const [dataTemperatura, setDataTemperatura] = useState([])
  const [date, setDate] = useState({
    fechaInicio: '13/02/2023',
    fechaFin: '16/02/2023',
  })

  useEffect(() => {
    getTemperature({
      fechaInicio: '12/02/2023',
      fechaFin: '15/02/2023',
    }).then((data) => {
      setDataTemperatura(data)
    })
  }, [])

  return (
    <>
      <div className="flex p-2 bg-gray-900">
        <h1 className="text font-semibold text-center text-white">
          Grupo 20 ACE2 - Temperatura
        </h1>
      </div>
      <div className="flex justify-center mt-10">
        {dataTemperatura.length > 0 && (
          <div className=" bg-gray-900 rounded-lg ring-2 ring-indigo-500 drop-shadow-2xl">
            <SimpleGraphic
              title="Temperatura a lo largo del tiempo"
              xLabel="datos obtenidos"
              yLabel="temperatura °C"
              dias={dataTemperatura.length}
              grados={dataTemperatura}
            />
          </div>
        )}
        {dataTemperatura.length == 0 && <Loader />}
      </div>
    </>
  )
}

export default temperaturaPage
