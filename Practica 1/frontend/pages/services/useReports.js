async function getData(dates) {
  const res = await fetch(
    'http://localhost:3001/api/consulta2' +
      '?' +
      new URLSearchParams({
        fechaInicio: dates.fechaInicio,
        fechaFin: dates.fechaFin,
      }),
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
  const data = await res.json()
  return data
}

async function getTemperature(dates) {
  const data = await getData(dates)
  if (data instanceof Array) {
    return data?.map((item) => item.temp) || []
  }
  return []
}

async function getHumidity(dates) {
  const data = await getData(dates)
  if (data instanceof Array) {
    return data?.map((item) => item.hum) || []
  }
  return []
}

async function getWindDirection(dates) {
  const data = await getData(dates)
  if (data instanceof Array) {
    return data?.map((item) => item.dir) || []
  }
  return []
}

async function getWindSpeed(dates) {
  const data = await getData(dates)
  if (data instanceof Array) {
    return data?.map((item) => item.vel) || []
  }
  return []
}

async function getPressure(dates) {
  const data = await getData(dates)
  if (data instanceof Array) {
    return data?.map((item) => item.pre * 0.750062) || []
  }
  return []
}

async function getDewPoint(dates) {
  const data = await getData(dates)
  if (data instanceof Array) {
    return data?.map((item) => item.dew_point) || []
  }
  return []
}

async function getAbsHumidity(dates) {
  const data = await getData(dates)
  if (data instanceof Array) {
    return data?.map((item) => item.abs_hum) || []
  }
  return []
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
