<script lang="ts">
	import MoodTrackerPlugin from "src/main";
	import StatsChart from "../stats/StatsChart.svelte";
	import store from "src/store";
    import { generateDatasetForDateRange, getMostCommonEmotions, getMostCommonMoodRating, getTotalAverageMoodRating } from "../stats/statsHelpers";
	import { IDayStats } from "src/entities/IDayStats";
	import { IMoodTrackerEntry } from "src/entities/MoodTrackerEntry";
	import SelectedDay from "./SelectedDay.svelte";
	import { DateService } from "src/services/dateService";

    let plugin: MoodTrackerPlugin;
    let startDate: string = DateService.createDateString(subtractDays(new Date(), 14));
    let endDate: string = DateService.createDateString(new Date());
    let moodRatingLabelDict: { [key: number]: string } = {};
    let timer: any;

    let rawData: IMoodTrackerEntry[] = this.plugin?.entries ?? [];
    let processedData: IDayStats[] = []; 

    store.plugin.subscribe((p) => {
        plugin = p;
        rawData = plugin?.entries ?? [];
        processedData = generateDatasetForDateRange(rawData, startDate, endDate);
        moodRatingLabelDict = plugin?.settings?.moodRatingLabelDict ?? {};
    });

    $: averageMoodRating = getTotalAverageMoodRating(processedData);
    $: mostCommonMood = getMostCommonMoodRating(rawData);
    $: mostCommonEmotions = getMostCommonEmotions(processedData, 3);


    export let selectedDateString: string; // selected date

    $: selectedDayData = rawData.filter((d) => DateService.createDateString(d?.dateTime) === selectedDateString) ?? [];

    function generateDatasetDebounced() {
        clearTimeout(timer);
        timer = setTimeout(() => {
            processedData = generateDatasetForDateRange(rawData, startDate, endDate);
        }, 1000)
    }



    function onClickChart(event: CustomEvent<number>) {
        selectedDateString = processedData[event.detail].date;
    }

    function subtractDays(date: Date, days: number) {
        const dateCopy = new Date(date);

        dateCopy.setDate(dateCopy.getDate() - days);

        return dateCopy;
}

</script>

<!-- date picker -->
<h2>Mood Tracking History</h2>
<div class="date-picker-container">
    from: <input bind:value={startDate} on:change={generateDatasetDebounced} type="date" min="2000-01-01" pattern="\d{4}-\d{2}-\d{2}" />
    to: <input bind:value={endDate} on:change={generateDatasetDebounced} type="date" min="2000-01-01"  required pattern="\d{4}-\d{2}-\d{2}"/>
</div>

<!-- chart -->
<StatsChart data={processedData} on:clickChart={onClickChart}/>

<!-- total stats -->
<div class="total-stats-container">
    <div>Average mood: {moodRatingLabelDict[Math.round(averageMoodRating)]} ({averageMoodRating})</div>
    <div>Most common mood: {moodRatingLabelDict[mostCommonMood]}</div>
    <div>Common emotions: {mostCommonEmotions.join(', ')}</div>
</div>

<SelectedDay plugin={plugin} dateString={selectedDateString} data={selectedDayData} moodRatingDict={moodRatingLabelDict}/>

<style>
    .date-picker-container {
        margin-bottom: 0.5rem;
    }

    .total-stats-container {
        margin-top: 1rem;
    }
</style>