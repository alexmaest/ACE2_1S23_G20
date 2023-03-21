import { useState } from 'react'
import moment from 'moment'
import Link from 'next/link'

export default function ChooserReport ({ title, path }) {
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'))
  const [time, setTime] = useState(moment().format('HH:mm'))

  const handleDate = (e) => {
    setDate(moment(e.target.value).format('YYYY-MM-DD'))
  }

  const handleTime = (e) => {
    setTime(moment(e.target.value, 'HH:mm').format('HH:mm'))
  }
  return (
        <div className="bg-gray-700 p-4 rounded-lg shadow-xl">
        <h2 className="text-xl font-bold mb-2 text-white">{title}</h2>
        <input
          type="date"
          value={date}
          onChange={handleDate}
          className="border border-gray-400 rounded p-2 w-full"
        />
        <input
          type="time"
          value={time}
          onChange={handleTime}
          className="border border-gray-400 rounded p-2 w-full"
        />
        <Link href={{
          pathname: path,
          query: { date, time }
        }}>
         <button className="bg-red-500 w-full h-8 font-bold text-gray-800 ring-2 ring-red-700 rounded mt-4">
            Ver
            </button>
        </Link>
      </div>
  )
}
