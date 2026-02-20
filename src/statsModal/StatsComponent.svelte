<script lang="ts">
	import MoodTrackerPlugin from "src/main";
	import BarChart from "../stats/charts/BarChart.svelte";
	import LineChart from "../stats/charts/LineChart.svelte";
	import DoughnutChart from "../stats/charts/DoughnutChart.svelte";
	import PolarAreaChart from "../stats/charts/PolarAreaChart.svelte";
	import RadarChart from "../stats/charts/RadarChart.svelte";
	import store from "src/store";
    import { generateDatasetForDateRange, getMostCommonEmotions, getMostCommonMoodRating, getTotalAverageMoodRating } from "../stats/statsHelpers";
	import { aggregateByMoodRating, aggregateByEmotion, aggregateByEmotionGroup, aggregateByDayOfWeek, type IAggregateData } from "../stats/aggregateHelpers";
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

    type ChartType = 'bar' | 'line' | 'doughnut' | 'polar' | 'radar';
    let chartType: ChartType = 'bar';

    type BreakdownType = 'mood-rating' | 'emotion' | 'emotion-group' | 'day-of-week';
    let breakdownType: BreakdownType = 'mood-rating';

    $: isTimeSeries = chartType === 'bar' || chartType === 'line';
    $: isAggregate = !isTimeSeries;

    // Filter raw entries by date range for aggregate charts
    $: filteredEntries = rawData.filter((e) => {
        const d = DateService.createDateString(e.dateTime);
        return d >= startDate && d <= endDate;
    });

    $: aggregateData = computeAggregateData(filteredEntries, breakdownType);

    function computeAggregateData(entries: IMoodTrackerEntry[], breakdown: BreakdownType): IAggregateData {
        switch (breakdown) {
            case 'mood-rating':
                return aggregateByMoodRating(entries, moodRatingLabelDict);
            case 'emotion':
                return aggregateByEmotion(entries, 10);
            case 'emotion-group':
                return aggregateByEmotionGroup(entries, plugin?.settings?.emotionGroups ?? []);
            case 'day-of-week':
                return aggregateByDayOfWeek(entries);
        }
    }

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
<div class="chart-controls">
    <div class="range-presets-container">
        <button class="range-preset-btn" class:is-active={activePreset === 'week'} on:click={() => setRangePreset('week')}>Week</button>
        <button class="range-preset-btn" class:is-active={activePreset === 'month'} on:click={() => setRangePreset('month')}>Month</button>
        <button class="range-preset-btn" class:is-active={activePreset === 'year'} on:click={() => setRangePreset('year')}>Year</button>
    </div>
    <div class="chart-type-container">
        <button class="chart-type-btn" class:is-active={chartType === 'bar'} on:click={() => chartType = 'bar'} aria-label="Bar chart">Bar</button>
        <button class="chart-type-btn" class:is-active={chartType === 'line'} on:click={() => chartType = 'line'} aria-label="Line chart">Line</button>
        <span class="chart-type-separator">|</span>
        <button class="chart-type-btn" class:is-active={chartType === 'doughnut'} on:click={() => chartType = 'doughnut'} aria-label="Doughnut chart">Doughnut</button>
        <button class="chart-type-btn" class:is-active={chartType === 'polar'} on:click={() => chartType = 'polar'} aria-label="Polar area chart">Polar</button>
        <button class="chart-type-btn" class:is-active={chartType === 'radar'} on:click={() => chartType = 'radar'} aria-label="Radar chart">Radar</button>
    </div>
</div>
<div class="date-picker-container">
    from: <input bind:value={startDate} on:change={onManualDateChange} type="date" min="2000-01-01" pattern="\d{4}-\d{2}-\d{2}" />
    to: <input bind:value={endDate} on:change={onManualDateChange} type="date" min="2000-01-01"  required pattern="\d{4}-\d{2}-\d{2}"/>
</div>

{#if isAggregate}
<div class="breakdown-container">
    Breakdown:
    <select bind:value={breakdownType}>
        <option value="mood-rating">Mood Rating</option>
        <option value="emotion">Top Emotions</option>
        <option value="emotion-group">Emotion Group</option>
        <option value="day-of-week">Day of Week</option>
    </select>
</div>
{/if}

<!-- chart -->
{#if chartType === 'bar'}
    <BarChart data={processedData} plugin={plugin} on:clickChart={onClickChart}/>
{:else if chartType === 'line'}
    <LineChart data={processedData} plugin={plugin} on:clickChart={onClickChart}/>
{:else if chartType === 'doughnut'}
    <DoughnutChart data={aggregateData} />
{:else if chartType === 'polar'}
    <PolarAreaChart data={aggregateData} />
{:else if chartType === 'radar'}
    <RadarChart data={aggregateData} chartColor={plugin?.settings?.chartColor ?? '#b26aba'} />
{/if}

<!-- total stats -->
<div class="total-stats-container">
    <div>Average mood: {moodRatingLabelDict[Math.round(averageMoodRating)]} ({averageMoodRating})</div>
    <div>Most common mood: {moodRatingLabelDict[mostCommonMood]}</div>
    <div>Common emotions: {mostCommonEmotions.join(', ')}</div>
</div>

{#if isTimeSeries}
<SelectedDay plugin={plugin} dateString={selectedDateString} data={selectedDayData} moodRatingDict={moodRatingLabelDict}/>
{/if}

<style>
    .chart-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .range-presets-container {
        display: flex;
        gap: 0.5rem;
    }

    .chart-type-container {
        display: flex;
        gap: 0.25rem;
        align-items: center;
    }

    .chart-type-separator {
        opacity: 0.3;
        margin: 0 0.15rem;
        user-select: none;
    }

    .range-preset-btn,
    .chart-type-btn {
        cursor: pointer;
    }

    .range-preset-btn.is-active,
    .chart-type-btn.is-active {
        font-weight: bold;
        box-shadow: inset 0 0 0 1.5px var(--interactive-accent);
    }

    .date-picker-container {
        margin-bottom: 0.5rem;
    }

    .breakdown-container {
        margin-bottom: 0.75rem;
    }

    .breakdown-container select {
        margin-left: 0.25rem;
    }

    .total-stats-container {
        margin-top: 1rem;
    }
</style>