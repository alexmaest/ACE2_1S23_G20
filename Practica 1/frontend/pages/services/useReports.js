async function getData() {
  const res = await fetch('http://localhost:3001/api/consulta2')
  const data = await res.json()
  return data
}

async function getTemperature() {
  const data = await getData()
  return data?.map((item) => item.temp)
}

async function getHumidity() {
  const data = await getData()
  return data?.map((item) => item.hum)
}

async function getWindDirection() {
  const data = await getData()
  return data?.map((item) => item.dir)
}

async function getWindSpeed() {
  const data = await getData()
  return data?.map((item) => item.vel)
}

async function getPressure() {
  const data = await getData()
  return data?.map((item) => item.pre)
}

async function getDewPoint() {
  const data = await getData()
  return data?.map((item) => item.dew_point)
}

async function getAbsHumidity() {
  const data = await getData()
  return data?.map((item) => item.abs_hum)
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
