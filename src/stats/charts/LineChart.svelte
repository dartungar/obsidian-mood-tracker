<script lang="ts">
	import { Line } from "svelte-chartjs";
	import { getRelativePosition } from "chart.js/helpers";
	import { Colors } from "chart.js";
	import { createEventDispatcher } from "svelte";
	import {
		Chart as ChartJS,
		Title,
		Tooltip,
		Legend,
		LineElement,
		BarElement,
		LinearScale,
		PointElement,
		CategoryScale,
		Filler,
		ChartData,
	} from "chart.js";
	import { IDayStats } from "src/entities/IDayStats";
	import MoodTrackerPlugin from "src/main";
	import { hexToRgba } from "./colorHelpers";

	ChartJS.register(
		Title,
		Tooltip,
		Legend,
		LineElement,
		BarElement,
		LinearScale,
		PointElement,
		CategoryScale,
		Filler,
		Colors,
	);

	export let data: IDayStats[] = [];
	export let plugin: MoodTrackerPlugin;

	let chartRef: any;
	let activeElementIndex: number;

	$: transformedData = transformData(data);

	function transformData(
		rawData: IDayStats[],
	): ChartData<"line", any, string> {
		return {
			labels: rawData.map((d) => d.date),
			datasets: [
				{
					label: "Average Mood Rating",
					data: rawData.map((d) => d.moodRating),
					spanGaps: true,
					borderColor: hexToRgba(plugin.settings.chartColor, 0.85),
					backgroundColor: hexToRgba(plugin.settings.chartColor, 0.2),
					pointBackgroundColor: rawData.map(() =>
						hexToRgba(plugin.settings.chartColor, 0.7),
					),
					pointRadius: 3,
					fill: true,
					tension: 0.3,
				},
			],
		};
	}

	const dispatch = createEventDispatcher();
	const datasetIndex = 0;

	const onClick = (e: any) => {
		try {
			const canvasPosition = getRelativePosition(e, chartRef);
			const dataX = chartRef.scales.x.getValueForPixel(canvasPosition.x);

			dispatch("clickChart", dataX);

			let activeElements = chartRef.getElementsAtEventForMode(
				e,
				"nearest",
				{ intersect: true },
				true,
			);

			if (activeElements.length > 0) {
				let firstElement = activeElements[0];
				let index = firstElement.index;

				// reset previous active point, highlight new one
				chartRef.data.datasets[datasetIndex].pointBackgroundColor[
					activeElementIndex
				] = hexToRgba(plugin.settings.chartColor, 0.7);
				chartRef.data.datasets[datasetIndex].pointBackgroundColor[
					index
				] = hexToRgba(plugin.settings.chartColor, 1);
				activeElementIndex = index;
			} else {
				chartRef.data.datasets[datasetIndex].pointBackgroundColor[
					activeElementIndex
				] = hexToRgba(plugin.settings.chartColor, 0.7);
			}
		} catch (error) {} // ChartJS gives errors when clicked on empty space; ignore them
	};

	const chartOptions = {
		responsive: true,
		onClick: onClick,
		scales: {
			y: {
				min: 1,
				max: 5,
				ticks: {
					stepSize: 1,
					callback: function (val: number, _: any) {
						return plugin.settings.moodRatingLabelDict[val];
					},
				},
			},
		},
	};
</script>

<Line bind:chart={chartRef} data={transformedData} options={chartOptions} />
