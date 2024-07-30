import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';
import { reportService } from '../../services/reportsService'
import { IncidentType } from "../elements/IncidentTypes";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


export const VerticalBarChart = () => {
  const [reportTypes, setReportTypes] = useState([])

  useEffect(() => {
    (async () => {
      const res = await reportService.getReportTypes()
      const incName = res?.data?.map((incident) => incident.name)
      setReportTypes(incName)
    })();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Report Chart',
      },
    },
  };
  
  const labels = reportTypes
  // = ['Armed Attack', 'Banditory', 'Bandory Dispute', 'Cattle Rustling', 'Community Agression', 'Criminal Activoty']
  // labels: ['Armed Attack', 'Banditory', 'Bandory Dispute', 'Cattle Rustling', 'Community Agression', 'Criminal Activoty'],
  
  
  const data = {
    labels,
    datasets: [
      {
        label: 'Injury',
        data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Deaths',
        data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };


  return <Bar options={options} data={data} />;
}
