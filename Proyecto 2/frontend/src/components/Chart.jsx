import React, { useState, useEffect } from "react";
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

import axios from "../api/axios";

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


const GET_ALL_DATA = "/api/sensorsData";
const GET_FILTERED_DATA = "/api/filteredData";

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
      position: 'top',
      labels: {
        color: 'rgb(255, 99, 132)',
        size: 20,
      },
    },
  },
  scales: {
    x: {
      ticks: {
        autoSkip: false,
        maxRotation: 90,
        minRotation: 90,
      }
    },
    y: {
      beginAtZero: true,
    }
  }
};


function Chart({ name }) {
  const navigate = useNavigate()
  const [value, setValue] = useState({
    startDate: "",
    endDate: ""
  });
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        borderColor: 'rgb(0, 0, 0)',
        backgroundColor: 'rgb(0, 0, 0)',
      },
    ],
  });

  const times = Array.from(Array(24).keys()).map((time) => {
    return time < 10 ? `0${time}:00` : `${time}:00`;
  });

  const handleValueChange = (newValue) => {
    setValue(newValue);
  }

  const getAllData = async () => {
    try {
      const { data } = await axios.get(GET_ALL_DATA);
      const labels = []
      const values = []
      if (name === "Temperatura Externa") {
        data.sensorsData[0].data.map((item) => {
          labels.push(new Date(item.date).toLocaleString());
          values.push(item.externalTemperature);
        });
      } else if (name === "Temperatura Interna") {
        data.sensorsData[0].data.map((item) => {
          labels.push(new Date(item.date).toLocaleString());
          values.push(item.internalTemperature);
        });
      } else if (name === "Humedad de Tierra") {
        data.sensorsData[0].data.map((item) => {
          labels.push(new Date(item.date).toLocaleString());
          values.push(item.soilMoisture);
        });
      } else if (name === "Porcentaje de Agua") {
        data.sensorsData[0].data.map((item) => {
          labels.push(new Date(item.date).toLocaleString());
          values.push(item.waterLevel);
        });
      } else {
        labels.push("1")
        values.push(1)
        labels.push("2")
        values.push(0)
      }
      setData({
        labels,
        datasets: [
          {
            data: values,
            borderColor: 'rgb(0, 0, 0)',
            backgroundColor: 'rgb(0, 0, 0)',
          },
        ],
      });
    } catch (error) {
      console.log(error);
    }
  }

  const getFilteredData = async () => {
    try {
      let { data } = await axios.get(GET_FILTERED_DATA, {
        data: {
          startDate: value.startDate,
          endDate: value.endDate,
          startTime,
          endTime,
          name
        }
      });

      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  const handleDateChange = () => {
    const startDateWithTime = new Date(value.startDate + " GMT-6");
    startDateWithTime.setHours(startTime.split(":")[0]);
    const endDateWithTime = new Date(value.endDate + " GMT-6");
    endDateWithTime.setHours(endTime.split(":")[0]);
    if (value.startDate === "" || value.endDate === "") {
      getAllData();
    } else {
      getFilteredData();
    }
  }

  useEffect(() => {
    getAllData();
  }, [])

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
          <Line options={options} data={data} className="backdrop-blur-lg bg-white/30 rounded shadow-2xl p-4" />
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
