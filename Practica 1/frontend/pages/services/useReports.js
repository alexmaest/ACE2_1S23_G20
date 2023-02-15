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
  return ['nodata']
}

async function getHumidity(dates) {
  const data = await getData(dates)
  if (data instanceof Array) {
    return data?.map((item) => item.hum) || []
  }
  return ['nodata']
}

async function getWindDirection(dates) {
  const data = await getData(dates)
  if (data instanceof Array) {
    return data?.map((item) => item.dir) || []
  }
  return ['nodata']
}

async function getWindSpeed(dates) {
  const data = await getData(dates)
  if (data instanceof Array) {
    return data?.map((item) => item.vel) || []
  }
  return ['nodata']
}

async function getPressure(dates) {
  const data = await getData(dates)
  if (data instanceof Array) {
    return data?.map((item) => item.pre * 0.750062) || []
  }
  return ['nodata']
}

async function getDewPoint(dates) {
  const data = await getData(dates)
  if (data instanceof Array) {
    return data?.map((item) => item.dew_point) || []
  }
  return ['nodata']
}

async function getAbsHumidity(dates) {
  const data = await getData(dates)
  if (data instanceof Array) {
    return data?.map((item) => item.abs_hum) || []
  }
  return ['nodata']
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
