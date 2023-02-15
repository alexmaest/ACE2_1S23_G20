import SimpleGraphic from './components/SimpleGraphic'
import { useEffect, useState } from 'react'
import { getAbsHumidity } from './services/useReports'
import Loader from './components/Loader'

function humedadAbsolutaPage({ dates }) {
  const [dataAbsHumidity, setDataAbsHumidity] = useState([])

  useEffect(() => {
    if (dates.fechaInicio === '31/12/1969' || dates.fechaFin === '31/12/1969')
      return
    getAbsHumidity(dates).then((data) => {
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
        {dataAbsHumidity.length > 0 && (
          <div className=" bg-gray-900 rounded-lg ring-2 ring-indigo-500 drop-shadow-2xl">
            <SimpleGraphic
              title="Humedad absoluta a lo largo del tiempo"
              xLabel="datos obtenidos"
              yLabel="humedad absoluta g/m³"
              dias={dataAbsHumidity.length}
              grados={dataAbsHumidity}
            />
          </div>
        )}
        {dataAbsHumidity.length == 0 && <Loader />}
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

export default humedadAbsolutaPage
