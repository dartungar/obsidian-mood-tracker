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


    let selectedDay = processedData[processedData.length - 1];
    $: selectedDayData = rawData.filter((d) => dateToNormalizedString(d?.dateTime) === selectedDay.date) ?? [];

    function generateDatasetDebounced() {
        clearTimeout(timer);
        timer = setTimeout(() => {
            processedData = generateDatasetForDateRange(rawData, startDate, endDate);
        }, 1000)
    }

    function getTotalAverageMoodRating(stats: IDayStats[]): number {
        const daysWithValues = stats.filter((s) => s.moodRating && s.moodRating > 0);
        const totalMoodRating = daysWithValues.reduce((acc, curr) => acc + curr.moodRating!, 0);
        return Math.round(totalMoodRating / daysWithValues.length * 10) / 10;
    }

    function getMostCommonMoodRating(entries: IMoodTrackerEntry[]): number {
        const moodRatings = entries.map((e) => e.moodRating);
        const uniqueMoodRatings = [...new Set(moodRatings)];
        const moodRatingCounts = uniqueMoodRatings.map((m) => {
            return {
                moodRating: m,
                count: moodRatings.filter((a) => a === m).length,
            };
        });
        const sortedMoodRatings = moodRatingCounts.sort((a, b) => b.count - a.count);
        const mostCommonMoodRating = sortedMoodRatings.map((m) => m.moodRating);
        return mostCommonMoodRating[0];
    }

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
        selectedDay = processedData[event.detail];
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
<!-- selected date (default = latest? or placeholder "click on a day in graph to show stats?") -->
<SelectedDay dateString={selectedDay.date} data={selectedDayData} moodRatingDict={moodRatingLabelDict}/>

<style>
    .date-picker-container {
        margin-bottom: 0.5rem;
    }

    .total-stats-container {
        margin-top: 1rem;
    }
</style>