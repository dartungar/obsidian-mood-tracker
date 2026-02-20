<script lang="ts">
	import MoodTrackerPlugin from "src/main";
	import StatsChart from "../stats/charts/BarChart.svelte";
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

    type RangePreset = 'week' | 'month' | 'year';
    let activePreset: RangePreset | null = null;

    function setRangePreset(preset: RangePreset) {
        const now = new Date();
        activePreset = preset;
        endDate = DateService.createDateString(now);
        switch (preset) {
            case 'week':
                startDate = DateService.createDateString(subtractDays(now, 7));
                break;
            case 'month':
                startDate = DateService.createDateString(subtractDays(now, 30));
                break;
            case 'year':
                startDate = DateService.createDateString(subtractDays(now, 365));
                break;
        }
        processedData = generateDatasetForDateRange(rawData, startDate, endDate);
    }

    function onManualDateChange() {
        activePreset = null;
        generateDatasetDebounced();
    }

</script>

<!-- date picker -->
<h2>Mood Tracking History</h2>
<div class="range-presets-container">
    <button class="range-preset-btn" class:is-active={activePreset === 'week'} on:click={() => setRangePreset('week')}>Week</button>
    <button class="range-preset-btn" class:is-active={activePreset === 'month'} on:click={() => setRangePreset('month')}>Month</button>
    <button class="range-preset-btn" class:is-active={activePreset === 'year'} on:click={() => setRangePreset('year')}>Year</button>
</div>
<div class="date-picker-container">
    from: <input bind:value={startDate} on:change={onManualDateChange} type="date" min="2000-01-01" pattern="\d{4}-\d{2}-\d{2}" />
    to: <input bind:value={endDate} on:change={onManualDateChange} type="date" min="2000-01-01"  required pattern="\d{4}-\d{2}-\d{2}"/>
</div>

<!-- chart -->
<StatsChart data={processedData} plugin={plugin} on:clickChart={onClickChart}/>

<!-- total stats -->
<div class="total-stats-container">
    <div>Average mood: {moodRatingLabelDict[Math.round(averageMoodRating)]} ({averageMoodRating})</div>
    <div>Most common mood: {moodRatingLabelDict[mostCommonMood]}</div>
    <div>Common emotions: {mostCommonEmotions.join(', ')}</div>
</div>

<SelectedDay plugin={plugin} dateString={selectedDateString} data={selectedDayData} moodRatingDict={moodRatingLabelDict}/>

<style>
    .range-presets-container {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
    }

    .range-preset-btn {
        cursor: pointer;
    }

    .range-preset-btn.is-active {
        font-weight: bold;
        box-shadow: inset 0 0 0 1.5px var(--interactive-accent);
    }

    .date-picker-container {
        margin-bottom: 0.5rem;
    }

    .total-stats-container {
        margin-top: 1rem;
    }
</style>