<script lang="ts">
	import { IMoodTrackerEntry } from "src/entities/MoodTrackerEntry";
	import { dateToNormalizedString } from "./statsHelpers";


    export let data: IMoodTrackerEntry[];
    export let dateString: string;

    console.log("selected day data:", data);

    // TODO: get dict from settings
    export let moodRatingDict: { [key: number]: string } = {
        1: "😨",
        2: "☹️",
        3: "😐",
        4: "🙂",
        5: "😊",
    };

    function getTimeFromDate(date: Date) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };


</script>

<!-- TODO: default value / placeholder / directions what to do ('click on chart to select a day') -->
<div>
	<h4>{dateString}</h4>
	{#if !data || data.length === 0}
		<div>No entries for this day. Click diagram to select another day.</div>
	{:else}
		{#each data as entry}
			<div>
				<span>{getTimeFromDate(entry.dateTime)}	{moodRatingDict[entry.moodRating]}	{entry.emotions.join(", ")}
				</span>
			</div>
		{/each}
	{/if}
</div>

<style>
</style>
