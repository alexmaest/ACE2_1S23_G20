import SimpleGraphic from './components/SimpleGraphic'
import { useEffect, useState } from 'react'
import { getWindSpeed } from './services/useReports'
import Loader from './components/Loader'

function velocidadVientoPage({ dates }) {
  const [dataWindSpeed, setDataWindSpeed] = useState([])

  useEffect(() => {
    if (dates.fechaInicio === '31/12/1969' || dates.fechaFin === '31/12/1969')
      return
    getWindSpeed(dates).then((data) => {
      setDataWindSpeed(data)
    })
  }, [])

  return (
    <>
      <div className="flex p-2 bg-gray-900">
        <h1 className="text font-semibold text-center text-white">
          Grupo 20 ACE2 - Velocidad del viento
        </h1>
      </div>
      <div className="flex justify-center mt-10">
        {dataWindSpeed.length > 0 && (
          <div className=" bg-gray-900 rounded-lg ring-2 ring-indigo-500 drop-shadow-2xl">
            <SimpleGraphic
              title="Velocidad viento a lo largo del tiempo"
              xLabel="datos obtenidos"
              yLabel="velocidad km/h"
              dias={dataWindSpeed.length}
              grados={dataWindSpeed}
            />
          </div>
        )}
        {dataWindSpeed.length == 0 && <Loader />}
      </div>
    </>
  )
}

export async function getServerSideProps(context) {
  return {
    props: {
      dates: {
        fechaInicio: context.query.fechaInicio,
        fechaFin: context.query.fechaFin,
      },
    },
  }
}

export default velocidadVientoPage
