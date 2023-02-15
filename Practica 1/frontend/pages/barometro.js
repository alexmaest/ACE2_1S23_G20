import SimpleGraphic from './components/SimpleGraphic'
import { useEffect, useState } from 'react'
import { getPressure } from './services/useReports'
import Loader from './components/Loader'
import Datepicker from 'react-tailwindcss-datepicker'

function barometroPage() {
  const [dataPressure, setDataPressure] = useState([])
  const [value, setValue] = useState({
    startDate: new Date(),
    endDate: new Date().setMonth(1),
  })
  const [date, setDate] = useState({
    fechaInicio: '12/02/2023',
    fechaFin: '14/02/2023',
  })

  useEffect(() => {
    if (date.fechaInicio === '31/12/1969' || date.fechaFin === '31/12/1969')
      return
    getPressure(date).then((data) => {
      setDataPressure(data)
    })
  }, [date])

  const handleValueChange = (newValue) => {
    setValue(newValue)
    setDate({
      fechaInicio:
        newValue.startDate instanceof Date
          ? newValue.startDate.toLocaleDateString('en-GB')
          : new Date(newValue.startDate).toLocaleDateString('en-GB'),
      fechaFin: new Date(newValue.endDate).toLocaleDateString('en-GB'),
    })
  }

  return (
    <>
      <div className="flex p-2 bg-gray-900">
        <h1 className="text font-semibold text-center text-white">
          Grupo 20 ACE2 - Barómetro
        </h1>
      </div>
      <div className="flex justify-center mt-10">
        {dataPressure.length > 0 && (
          <div className=" bg-gray-900 rounded-lg ring-2 ring-indigo-500 drop-shadow-2xl">
            <SimpleGraphic
              title="Presión barométrica a lo largo del tiempo"
              xLabel="datos obtenidos"
              yLabel="presión barométrica mmHg"
              dias={dataPressure.length}
              grados={dataPressure}
            />
            <Datepicker
              primaryColor="indigo"
              value={value}
              onChange={handleValueChange}
            />
          </div>
        )}
        {dataPressure.length == 0 && <Loader />}
      </div>
    </>
  )
}

export default barometroPage
