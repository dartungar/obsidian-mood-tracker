<script lang="ts">
	import MoodTrackerPlugin from "src/main";
	import StatsChart from "./StatsChart.svelte";
	import store from "src/store";
    import { dateToNormalizedString, generateDatasetForDateRange, getAverageMoodRatingByDay } from "./statsHelpers";
	import { IDayStats } from "src/entities/IDayStats";
	import { IMoodTrackerEntry } from "src/entities/MoodTrackerEntry";
	import SelectedDay from "./SelectedDay.svelte";

    let plugin: MoodTrackerPlugin;
    let startDate: string = dateToNormalizedString(subtractDays(new Date(), 14));
    let endDate: string = dateToNormalizedString(new Date());


    let rawData: IMoodTrackerEntry[] = this.plugin?.entries ?? [];
    $: processedData = generateDatasetForDateRange(rawData, startDate, endDate);

    store.plugin.subscribe((p) => {
        plugin = p;
        rawData = plugin?.entries ?? [];
        processedData = generateDatasetForDateRange(rawData, startDate, endDate);
    });

    $: averageMoodRating = Math.round(processedData.filter(d => d.moodRating && d.moodRating > 0).reduce((acc, curr) => acc + (curr.moodRating ?? 0), 0) / processedData.length * 10) / 10;
    $: mostCommonEmotions = getMostCommonEmotions(processedData, 3);


    let selectedDay = processedData[processedData.length - 1];
    $: selectedDayData = rawData.filter((d) => dateToNormalizedString(d?.dateTime) === selectedDay.date) ?? [];

    function getMostCommonEmotions(stats: IDayStats[], count: number): string[] {
        const allEmotions = stats.map((s) => s.emotions).flat();
        const uniqueEmotions = [...new Set(allEmotions)];
        const emotionCounts = uniqueEmotions.map((e) => {
            return {
                emotion: e,
                count: allEmotions.filter((a) => a === e).length,
            };
        });
        const sortedEmotions = emotionCounts.sort((a, b) => b.count - a.count);
        const mostCommonEmotions = sortedEmotions.map((e) => e.emotion);
        return mostCommonEmotions.splice(0, count);
    }

    function onClickChart(event: CustomEvent<number>) {
        console.log("clicked chart", event.detail, processedData[event.detail])
        selectedDay = processedData[event.detail];
    }

    function subtractDays(date: Date, days: number) {
        const dateCopy = new Date(date);

        dateCopy.setDate(dateCopy.getDate() - days);

        return dateCopy;
}

</script>

<!-- date picker -->
<h2>Mood Tracking Stats</h2>
<div class="date-picker-container">
    from: <input bind:value={startDate} type="date" required pattern="\d{4}-\d{2}-\d{2}" />
    to: <input bind:value={endDate} type="date" required pattern="\d{4}-\d{2}-\d{2}"/>
</div>
<!-- chart -->
<StatsChart data={processedData} on:clickChart={onClickChart}/>
<!-- total stats -->
<div class="total-stats-container">
    <div>Average: {averageMoodRating}</div>
    <div>Common emotions: {mostCommonEmotions.join(', ')}</div>
</div>
<!-- selected date (default = latest? or placeholder "click on a day in graph to show stats?") -->
<SelectedDay dateString={selectedDay.date} data={selectedDayData}/>

<style>
    .date-picker-container {
        margin-bottom: 0.5rem;
    }

    .total-stats-container {
        margin-top: 1rem;
    }
</style>