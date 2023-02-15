import SimpleGraphic from './components/SimpleGraphic'
import { useEffect, useState } from 'react'
import { getPressure } from './services/useReports'
import Loader from './components/Loader'
import Warning from './components/Warning'

function barometroPage({ dates }) {
  const [dataPressure, setDataPressure] = useState([])

  useEffect(() => {
    if (dates.fechaInicio === '31/12/1969' || dates.fechaFin === '31/12/1969')
      return
    getPressure(dates).then((data) => {
      setDataPressure(data)
    })
  }, [])

  return (
    <>
      <div className="flex p-2 bg-gray-900">
        <h1 className="text font-semibold text-center text-white">
          Grupo 20 ACE2 - Barómetro
        </h1>
      </div>
      <div className="flex justify-center mt-10">
        {dataPressure.length > 0 && dataPressure[0] !== 'nodata' && (
          <div className=" bg-gray-900 rounded-lg ring-2 ring-indigo-500 drop-shadow-2xl">
            <SimpleGraphic
              title="Presión barométrica a lo largo del tiempo"
              xLabel={`datos desde ${dates.fechaInicio} hasta ${dates.fechaFin}`}
              yLabel="presión barométrica mmHg"
              dias={dataPressure.length}
              grados={dataPressure}
            />
          </div>
        )}
        {dataPressure.length == 0 && <Loader />}
        {dataPressure[0] == 'nodata' && <Warning />}
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

export default barometroPage
