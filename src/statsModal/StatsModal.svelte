<script lang="ts">
	import MoodTrackerPlugin from "src/main";
	import StatsChart from "./StatsChart.svelte";
	import store from "src/store";
    import { getAverageMoodRatingByDay } from "./statsHelpers";

    let plugin: MoodTrackerPlugin;
    let rawData = this.plugin?.entries ?? [];
    let processedData = getAverageMoodRatingByDay(rawData);
    
    store.plugin.subscribe((p) => {
        console.log("StatsModal: plugin store value updated", p);
        plugin = p;
        rawData = plugin?.entries ?? [];
        processedData = getAverageMoodRatingByDay(rawData);
    });



    $: console.log("data", rawData, processedData, this.plugin);

</script>

<!-- <StatsChart bind:data={data} /> -->
<StatsChart data={processedData}/>