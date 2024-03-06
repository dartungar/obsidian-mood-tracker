<script lang="ts">
	import store from "src/store";
	import MoodTrackerPlugin from "../main";
	import MoodRating from "./MoodRating.svelte";
	import MoodSelector from "./MoodSelector.svelte";
	import {
		IMoodTrackerEntry,
		MoodTrackerEntry,
	} from "src/entities/MoodTrackerEntry";
	import { EmotionGroup } from "src/entities/IEmotionGroup";
	import moment from "moment";
	import { DateService } from "src/services/dateService";

	let plugin: MoodTrackerPlugin;
	let moodSections: EmotionGroup[] = [];
	let moodRatingLabelDict: { [key: number]: string } = {};
	let insertToNote = false;

	export let entry: IMoodTrackerEntry;

	$: dateTimeString = DateService.createDateTimeString(entry.dateTime);

	store.plugin.subscribe((p) => {
		moodSections = p.settings.emotionGroups;
		plugin = p;
		moodRatingLabelDict = p.settings.moodRatingLabelDict;
		insertToNote = plugin.settings.addToJournal;
	});

	function handleSetRating(event: any) {
		entry.moodRating = Number(event.detail.rating);
	}

	function handleToggleMood(event: any) {
		if (entry.emotions.includes(event.detail.mood)) {
			entry.emotions = entry.emotions.filter(
				(m) => m !== event.detail.mood,
			);
		} else {
			entry.emotions.push(event.detail.mood);
		}
	}

	function handleDateTimeChange(event: any) {
		entry.dateTime = window.moment(event.target.value).toDate();
	}

	async function saveEntry() {
		await plugin!.saveEntry(entry);
		if (insertToNote) {
			plugin!.noteService.addEntryToJournal(entry);
		}
		closeModalFunc();
	}

	export let closeModalFunc: () => void;
</script>

<div class="modal-inner-container">
	<div style="display: flex; justify-content: center">
		<h3>{plugin.settings.trackerModalTitle}</h3>
	</div>

	<div class="mood-rating-container">
		<MoodRating
			emoji={moodRatingLabelDict[1]}
			fontSize={plugin.settings.moodRatingLabelSize}
			title="very bad"
			rating="1"
			on:setRating={handleSetRating}
			bind:activeRating={entry.moodRating}
		/>
		<MoodRating
			emoji={moodRatingLabelDict[2]}
			fontSize={plugin.settings.moodRatingLabelSize}
			title="bad"
			rating="2"
			on:setRating={handleSetRating}
			bind:activeRating={entry.moodRating}
		/>
		<MoodRating
			emoji={moodRatingLabelDict[3]}
			fontSize={plugin.settings.moodRatingLabelSize}
			title="ok"
			rating="3"
			on:setRating={handleSetRating}
			bind:activeRating={entry.moodRating}
		/>
		<MoodRating
			emoji={moodRatingLabelDict[4]}
			fontSize={plugin.settings.moodRatingLabelSize}
			title="good"
			rating="4"
			on:setRating={handleSetRating}
			bind:activeRating={entry.moodRating}
		/>
		<MoodRating
			emoji={moodRatingLabelDict[5]}
			fontSize={plugin.settings.moodRatingLabelSize}
			title="very good"
			rating="5"
			on:setRating={handleSetRating}
			bind:activeRating={entry.moodRating}
		/>
	</div>

	{#if plugin.settings.useEmotions}
		<div class="feelings-container">
			<MoodSelector
				on:toggleMood={handleToggleMood}
				bind:activeMoods={entry.emotions}
				{moodSections}
			/>
		</div>
	{/if}

	<div class="note-container" style="font-size: 100%;">
		<textarea
			class="note"
			placeholder="add a note about what you feel (optional)"
			bind:value={entry.note}
		></textarea>
	</div>
	<div style="display: flex; justify-content: space-between">
		<div style="display: flex; align-items: center; gap: 0.8rem;">
			<span>date & time of entry </span><input
				id="datetime"
				type="datetime-local"
				value={dateTimeString}
				on:change={handleDateTimeChange}
				style="cursor: pointer;"
			/><label for="datetime"></label>
		</div>
		<button style="cursor: pointer;" on:click={saveEntry}>Save</button>
	</div>
</div>

<style>
	.modal-inner-container > div {
		margin: 0.5rem;
	}

	.mood-rating-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		height: 100%;
		width: 100%;
	}

	.note {
		width: 100%;
		height: 100%;
		resize: none;
		border: none;
		outline: none;
		font-size: 1.2rem;
		padding: 0.5rem;
		border: 1px solid var(--background-modifier-border);
	}
</style>
