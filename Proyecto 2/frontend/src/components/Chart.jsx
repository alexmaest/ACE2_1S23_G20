import React, { useState } from "react";
import { useNavigate } from "react-router-dom"
import Datepicker from "react-tailwindcss-datepicker";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

ChartJS.defaults.color = 'black';
ChartJS.defaults.font.size = 14;
ChartJS.defaults.font.family = 'Chivo Mono';
ChartJS.defaults.font.weight = 'bold';

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: 'rgb(255, 99, 132)',
        size: 20,
      },
    },
  },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: [65, 59, 80, 81, 56, 55, 40],
      borderColor: 'rgb(0, 0, 0)',
      backgroundColor: 'rgb(0, 0, 0)',
    },
  ],
};

function Chart({ name }) {
  const navigate = useNavigate()
  const [value, setValue] = useState({
    startDate: "",
    endDate: ""
  });
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const times = Array.from(Array(24).keys()).map((time) => {
    return time < 10 ? `0${time}:00` : `${time}:00`;
  });

  const handleValueChange = (newValue) => {
    setValue(newValue);
  }

  const handleDateChange = () => {
    const startDateWithTime = new Date(value.startDate + " GMT-6");
    startDateWithTime.setHours(startTime.split(":")[0]);
    const endDateWithTime = new Date(value.endDate + " GMT-6");
    endDateWithTime.setHours(endTime.split(":")[0]);
    console.log(startDateWithTime, endDateWithTime);
  }


  return (
    <div className="w-full h-full min-h-screen flex items-center bg-gradient-to-l from-sky-500 to-emerald-500">
      <div className="container grid gap-8">
        <div className="flex justify-between font-chivo-mono">
          <p className="text-4xl">{name}</p>
          <button
            className="rounded-full bg-green-400 hover:hover:brightness-105 px-8 py-2"
            onClick={() => navigate("/")}
          >Regresar</button>
        </div>
        <div className="w-full flex justify-center">
          <Line options={options} data={data} />
        </div>
        <div className="flex justify-evenly font-chivo-mono">
          <div className="basis-1/6">
            <Datepicker
              primaryColor="green"
              separator="-"
              value={value}
              onChange={handleValueChange}
              displayFormat={"DD/MM/YYYY"}
              readOnly
            />
          </div>
          <div className="basis-1/6">
            <select
              className="bg-gray-50 text-md rounded-lg block w-full p-2.5 dark:bg-blue-500 dark:border-gray-600 "
              onChange={(e) => setStartTime(e.target.value)}
              value={startTime}
            >
              {times.map((time, index) => {
                return <option key={index} value={time}>{time}</option>
              })}
            </select>
          </div>
          <div className="basis-1/6">
            <select
              className="bg-gray-50 text-md rounded-lg block w-full p-2.5 dark:bg-blue-500 dark:border-gray-600"
              onChange={(e) => setEndTime(e.target.value)}
              value={endTime}
            >
              {times.map((time, index) => {
                return <option key={index} value={time}>{time}</option>
              })}
            </select>
          </div>
          <button
            className="rounded-full bg-green-400 hover:hover:brightness-105 px-8 py-2 basis-1/6"
            onClick={handleDateChange}
          >Escoger</button>
        </div>
      </div>
    </div>
  )
}

export default Chart
