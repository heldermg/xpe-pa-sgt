import React from 'react'
import Head from 'next/head'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { ChartData } from './ChartData'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface ChartProps {
  title: string,
  labels: string[],
  datasets: ChartData[],
}

function Chart({ title, labels, datasets}: ChartProps) {

  const data = {
    labels,
    datasets
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
  }

  return (
    <Bar 
      options={options} 
      data={data} 
    />
  )
}

export default Chart
