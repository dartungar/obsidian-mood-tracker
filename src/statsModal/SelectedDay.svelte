<script lang="ts">
	import { IMoodTrackerEntry, MoodTrackerEntry } from "src/entities/MoodTrackerEntry";
	import MoodTrackerPlugin from "src/main";


    export let data: IMoodTrackerEntry[];
    export let dateString: string;
    export let plugin: MoodTrackerPlugin;
    export let moodRatingDict: { [key: number]: string } = plugin.settings.moodRatingLabelDict;

    function getTimeFromDate(date: Date) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    function openModalForNewEntry() {
        const entry = new MoodTrackerEntry();
        entry.dateTime = new Date(dateString);
        entry.dateTime.setHours(9); // default value is 9:00 AM 
        openMoodTrackerModal(entry);
    }

    function openMoodTrackerModal(entry: IMoodTrackerEntry) {
        plugin.openTrackerModal(entry, true);
    }
</script>

<div>
	<h4>{dateString}</h4>
	{#if !data || data.length === 0}
		<div>No entries for this day. Click diagram to select another day.</div>
	{:else}
		{#each data as entry}
			<div>
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <span style="cursor: pointer;" title="edit entry" on:click={() => openMoodTrackerModal(entry)}>✏️</span>
				<span>{getTimeFromDate(entry.dateTime)}	{moodRatingDict[entry.moodRating]}	{entry.emotions.join(", ")}
				</span>
                {#if entry.note}
                    <span>📄 <i>{entry.note}</i></span>
                {/if}
			</div>
		{/each}
	{/if}
<div><button on:click={openModalForNewEntry} style="cursor: pointer; margin-top: 0.5rem">add a new entry</button></div>
</div>

<style>
</style>
