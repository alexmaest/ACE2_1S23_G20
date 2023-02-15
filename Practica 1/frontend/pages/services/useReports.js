async function getData(dates) {
  const res = await fetch('http://localhost:3001/api/consulta2' + "?" + new URLSearchParams({
    dates
  }), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  const data = await res.json()
  return data
}

async function getTemperature(dates) {
  const data = await getData(dates)
  return data?.map((item) => item.temp) || []
}

async function getHumidity() {
  const data = await getData()
  return data?.map((item) => item.hum) || []
}

async function getWindDirection() {
  const data = await getData()
  return data?.map((item) => item.dir) || []
}

async function getWindSpeed() {
  const data = await getData()
  return data?.map((item) => item.vel) || []
}

async function getPressure() {
  const data = await getData()
  return data?.map((item) => item.pre * 0.750062) || []
}

async function getDewPoint() {
  const data = await getData()
  return data?.map((item) => item.dew_point) || []
}

async function getAbsHumidity() {
  const data = await getData()
  return data?.map((item) => item.abs_hum) || []
}

export {
  getTemperature,
  getHumidity,
  getWindDirection,
  getWindSpeed,
  getPressure,
  getDewPoint,
  getAbsHumidity,
  getData,
}
