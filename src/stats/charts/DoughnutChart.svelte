<script lang="ts">
	import { Doughnut } from "svelte-chartjs";
	import { Colors } from "chart.js";
	import {
		Chart as ChartJS,
		Title,
		Tooltip,
		Legend,
		ArcElement,
		ChartData,
	} from "chart.js";
	import type { IAggregateData } from "../aggregateHelpers";
	import { hexToRgba } from "./colorHelpers";

	ChartJS.register(Title, Tooltip, Legend, ArcElement, Colors);

	export let data: IAggregateData;

	$: transformedData = transformData(data);

	function transformData(raw: IAggregateData): ChartData<"doughnut", number[], string> {
		return {
			labels: raw.labels,
			datasets: [
				{
					data: raw.values,
					backgroundColor: raw.colors.map((c) => hexToRgba(c, 0.7)),
					hoverBackgroundColor: raw.colors.map((c) => hexToRgba(c, 0.9)),
					borderWidth: 1,
				},
			],
		};
	}

	const chartOptions = {
		responsive: true,
		plugins: {
			legend: {
				position: "right" as const,
			},
		},
	};
</script>

<div class="aggregate-chart-wrapper">
	<Doughnut data={transformedData} options={chartOptions} />
</div>

<style>
	.aggregate-chart-wrapper {
		max-width: 500px;
		margin: 0 auto;
	}
</style>
