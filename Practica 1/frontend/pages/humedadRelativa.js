import SimpleGraphic from './components/SimpleGraphic'
import { useEffect, useState } from 'react'
import { getHumidity } from './services/useReports'
import Loader from './components/Loader'

function humedadRelativaPage({ dates }) {
  const [dataHumedadRelativa, setDataHumedadRelativa] = useState([])

  useEffect(() => {
    if (dates.fechaInicio === '31/12/1969' || dates.fechaFin === '31/12/1969')
      return
    getHumidity(dates).then((data) => {
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
        {dataHumedadRelativa.length > 0 && (
          <div className=" bg-gray-900 rounded-lg ring-2 ring-indigo-500 drop-shadow-2xl">
            <SimpleGraphic
              title="Humedad relativa a lo largo del tiempo"
              xLabel="datos obtenidos"
              yLabel="porcentaje %"
              dias={dataHumedadRelativa.length}
              grados={dataHumedadRelativa}
            />
          </div>
        )}
        {dataHumedadRelativa.length == 0 && <Loader />}
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

export default humedadRelativaPage
