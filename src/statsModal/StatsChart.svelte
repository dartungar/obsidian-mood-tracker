<script lang="ts">
	import { Bar } from "svelte-chartjs";
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
		ChartData,
	} from "chart.js";
	import { IDayStats } from "src/entities/IDayStats";
	import { DEFAULT_SETTINGS, MoodTrackerSettings } from "src/settings/moodTrackerSettings";

	ChartJS.register(
		Title,
		Tooltip,
		Legend,
		LineElement,
		BarElement,
		LinearScale,
		PointElement,
		CategoryScale,
		Colors,
	);

	export let data: IDayStats[] = [];

	let chartRef: any;

	$: transformedData = transformData(data);

	function transformData(
		rawData: IDayStats[],
	): ChartData<"bar", any, string> {
		return {
			labels: rawData.map((d) => d.date),
			datasets: [
				{
					label: "Average Mood Rating",
					data: rawData.map((d) => d.moodRating),
					//spanGaps: true,
					// backgroundColor: "var(--text-muted)",
					//pointBackgroundColor: "var(--text-normal)",
				},
			],
		};
	}

	const dispatch = createEventDispatcher();

	const onClick = (e: any) => {
		const canvasPosition = getRelativePosition(e, chartRef);
		const dataX = chartRef.scales.x.getValueForPixel(canvasPosition.x);

		dispatch("clickChart", dataX);

		// TODO: highlight clicked element
		const clickedElement = chartRef.getElementsAtEventForMode(
			e,
			"nearest",
			{ intersect: true },
			true,
		)[0].element;
	};


	const chartOptions = {
		responsive: true,
		onClick: onClick,
		// TODO: scales based on possible mood values
		scales: {
			y: {
				min: 1,
				max: 5,
				ticks: {
					stepSize: 1, 
					callback: function(val: number, _: any) {
						// TODO: use ones from plugin settings!
            			return DEFAULT_SETTINGS.moodRatingLabelDict[val];
          			},
				},
			},
		},
	};
</script>

<Bar bind:chart={chartRef} data={transformedData} options={chartOptions} />
