import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import Datepicker from "react-tailwindcss-datepicker";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import zoomPlugin from 'chartjs-plugin-zoom';

import axios from "../api/axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
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
    zoom: {
      pan: {
        enabled: true,
        mode: 'x'
      },
      zoom: {
        pinch: {
          enabled: true       // Enable pinch zooming
        },
        wheel: {
          enabled: true       // Enable wheel zooming
        },
        mode: 'x',
      }
    }
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
      suggestedMax: 1,
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
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("00:00");
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
        data.sensorsData[0].data.map((item) => {
          labels.push(new Date(item.date).toLocaleString());
          if (item.isPumpOn) {
            values.push(1);
          } else {
            values.push(0.005);
          }
        });
      }
      setData({
        labels,
        datasets: [
          {
            barPercentage: 1.0,
            categoryPercentage: 1.0,
            data: values,
            borderColor: 'rgb(0, 21, 36)',
            borderWidth: 2,
            backgroundColor: 'rgba(0, 21, 36)',
          },
        ],
      });
    } catch (error) {
      console.log(error);
    }
  }


  const getFilteredData = async () => {
    try {
      const labels = []
      const values = []

      const startDateWithTime = new Date(value.startDate + " GMT-6");
      startDateWithTime.setHours(startTime.split(":")[0]);
      const endDateWithTime = new Date(value.endDate + " GMT-6");
      endDateWithTime.setHours(endTime.split(":")[0]);

      const { data } = await axios.get(GET_FILTERED_DATA + `/${startDateWithTime}/${endDateWithTime}`);

      if (name === "Temperatura Externa") {
        data.filteredData.map((item) => {
          labels.push(new Date(item.date).toLocaleString());
          values.push(item.externalTemperature);
        });
      } else if (name === "Temperatura Interna") {
        data.filteredData.map((item) => {
          labels.push(new Date(item.date).toLocaleString());
          values.push(item.internalTemperature);
        });
      } else if (name === "Humedad de Tierra") {
        data.filteredData.map((item) => {
          labels.push(new Date(item.date).toLocaleString());
          values.push(item.soilMoisture);
        });
      } else if (name === "Porcentaje de Agua") {
        data.filteredData.map((item) => {
          labels.push(new Date(item.date).toLocaleString());
          values.push(item.waterLevel);
        });
      } else {
        data.filteredData.map((item) => {
          labels.push(new Date(item.date).toLocaleString());
          if (item.isPumpOn) {
            values.push(1);
          } else {
            values.push(0.005);
          }
        });
      }
      setData({
        labels,
        datasets: [
          {
            barPercentage: 1.0,
            categoryPercentage: 1.0,
            data: values,
            borderColor: 'rgb(0, 21, 36)',
            borderWidth: 2,
            backgroundColor: 'rgba(0, 21, 36)',
          },
        ],
      });
    } catch (error) {
      console.log(error);
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
          {name !== "Periodo de Activación de la Bomba"
            ? <Line options={options} data={data} className="max-w-11/12 backdrop-blur-lg bg-white/30 rounded shadow-2xl p-4 overflow-x-auto" />
            : <Bar options={options} data={data} className="max-w-11/12 backdrop-blur-lg bg-white/30 rounded shadow-2xl p-4 overflow-x-auto" />
          }
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
            onClick={() => getFilteredData()}
          >Escoger</button>
        </div>
      </div>
    </div>
  )
}

export default Chart
