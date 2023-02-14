import SimpleGraphic from './components/SimpleGraphic'
import { useEffect, useState } from 'react'
import { getTemperature } from './services/useReports'

function temperaturaPage() {
  const [dataTemperatura, setDataTemperatura] = useState([])

  useEffect(() => {
    getTemperature().then((data) => {
      setDataTemperatura(data)
    })
  }, [])

  return (
    <div className="flex justify-center">
      <div className=" bg-gray-900 rounded-lg">
        {dataTemperatura.length > 0 && (
          <SimpleGraphic
            title="Temperatura a lo largo del tiempo"
            xLabel="datos obtenidos"
            yLabel="temperatura °C"
            dias={dataTemperatura.length}
            grados={dataTemperatura}
          />
        )}
      </div>
    </div>
  )
}

export default temperaturaPage
