<script lang="ts">
	import { PolarArea } from "svelte-chartjs";
	import { Colors } from "chart.js";
	import {
		Chart as ChartJS,
		Title,
		Tooltip,
		Legend,
		ArcElement,
		RadialLinearScale,
		ChartData,
	} from "chart.js";
	import type { IAggregateData } from "../aggregateHelpers";
	import { hexToRgba } from "./colorHelpers";

	ChartJS.register(Title, Tooltip, Legend, ArcElement, RadialLinearScale, Colors);

	export let data: IAggregateData;

	$: transformedData = transformData(data);

	function transformData(raw: IAggregateData): ChartData<"polarArea", number[], string> {
		return {
			labels: raw.labels,
			datasets: [
				{
					data: raw.values,
					backgroundColor: raw.colors.map((c) => hexToRgba(c, 0.6)),
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
	<PolarArea data={transformedData} options={chartOptions} />
</div>

<style>
	.aggregate-chart-wrapper {
		max-width: 500px;
		margin: 0 auto;
	}
</style>
