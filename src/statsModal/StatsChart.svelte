<script>
	import { Line } from 'svelte-chartjs';
  import { getRelativePosition } from 'chart.js/helpers';

	import {
	  Chart as ChartJS,
	  Title,
	  Tooltip,
	  Legend,
	  LineElement,
	  LinearScale,
	  PointElement,
	  CategoryScale,
	} from 'chart.js';
  
	ChartJS.register(
	  Title,
	  Tooltip,
	  Legend,
	  LineElement,
	  LinearScale,
	  PointElement,
	  CategoryScale
	);

  export let data;

  console.log("data in statsChart", data);

  let chartRef;

    export const transformedData = {
    labels: data.map(d => d.date),
    datasets: [
      {
        label: 'Mood Rating',
        fill: true,
        lineTension: 0.3,
        backgroundColor: 'rgba(225, 204,230, .3)',
        borderColor: 'rgb(205, 130, 158)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgb(205, 130,1 58)',
        pointBackgroundColor: 'rgb(255, 255, 255)',
        pointBorderWidth: 10,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgb(0, 0, 0)',
        pointHoverBorderColor: 'rgba(220, 220, 220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: data.map(d => d.moodRating),
      }
    ],
  };

  const onClick = (e) => { 
    const canvasPosition = getRelativePosition(e, chartRef);

    // Substitute the appropriate scale IDs
    const dataX = chartRef.scales.x.getValueForPixel(canvasPosition.x);
    const dataY = chartRef.scales.y.getValueForPixel(canvasPosition.y);

    console.log("clicked chart:", dataX, dataY);
  }

  </script>
  
  <Line bind:chart={chartRef} data={transformedData} options={{ responsive: true, onClick }} />