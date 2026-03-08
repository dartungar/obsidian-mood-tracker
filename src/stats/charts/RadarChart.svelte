<script lang="ts">
	import { Radar } from "svelte-chartjs";
	import { Colors } from "chart.js";
	import {
		Chart as ChartJS,
		Title,
		Tooltip,
		Legend,
		LineElement,
		PointElement,
		RadialLinearScale,
		Filler,
		ChartData,
	} from "chart.js";
	import type { IAggregateData } from "../aggregateHelpers";
	import { hexToRgba } from "./colorHelpers";

	ChartJS.register(
		Title, Tooltip, Legend, LineElement, PointElement,
		RadialLinearScale, Filler, Colors,
	);

	export let data: IAggregateData;
	export let chartColor: string;

	$: transformedData = transformData(data);

	function transformData(raw: IAggregateData): ChartData<"radar", number[], string> {
		return {
			labels: raw.labels,
			datasets: [
				{
					label: "Value",
					data: raw.values,
					backgroundColor: hexToRgba(chartColor, 0.2),
					borderColor: hexToRgba(chartColor, 0.8),
					pointBackgroundColor: hexToRgba(chartColor, 0.8),
					fill: true,
				},
			],
		};
	}

	const chartOptions = {
		responsive: true,
		scales: {
			r: {
				beginAtZero: true,
			},
		},
		plugins: {
			legend: {
				display: false,
			},
		},
	};
</script>

<div class="aggregate-chart-wrapper">
	<Radar data={transformedData} options={chartOptions} />
</div>

<style>
	.aggregate-chart-wrapper {
		max-width: 500px;
		margin: 0 auto;
	}
</style>
