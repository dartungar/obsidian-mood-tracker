<script lang="ts">
	import { EmotionGroup } from "src/entities/IEmotionGroup";
	import MoodTrackerPlugin from "src/main";
	import store from "src/store";

	export let closeModalFunc: () => void;

	let plugin: MoodTrackerPlugin;

	store.plugin.subscribe((p) => {
		plugin = p;
	});

	function save() {
		plugin.saveSettings();
		closeModalFunc();
	}
</script>

<div class="edit-mood-labels-modal">
	<div class="labels-aligned">
		<div>
			<label for="veryGood">Very Good</label>
			<input
				id="veryGood"
				type="text"
				bind:value={plugin.settings.moodRatingLabelDict[5]}
			/>
		</div>
		<div>
			<label for="good">Good</label>
			<input
				id="good"
				type="text"
				bind:value={plugin.settings.moodRatingLabelDict[4]}
			/>
		</div>
		<div>
			<label for="ok">Ok</label>
			<input
				id="ok"
				type="text"
				bind:value={plugin.settings.moodRatingLabelDict[3]}
			/>
		</div>
		<div>
			<label for="bad">Bad</label>
			<input
				id="bad"
				type="text"
				bind:value={plugin.settings.moodRatingLabelDict[2]}
			/>
		</div>
		<div>
			<label for="veryBad">Very bad</label>
			<input
				id="veryBad"
				type="text"
				bind:value={plugin.settings.moodRatingLabelDict[1]}
			/>
		</div>
		<div style="margin-top: 8px;">
			<label for="size"
				>Label size: {plugin.settings.moodRatingLabelSize} rem</label
			>
			<input
				id="size"
				type="range"
				min="0.5"
				max="5"
				step="0.5"
				bind:value={plugin.settings.moodRatingLabelSize}
			/>
		</div>
	</div>

	<div>
		<div>Preview:</div>
		<div style="font-size: {plugin.settings.moodRatingLabelSize + 'rem'}">
			{plugin.settings.moodRatingLabelDict[1]}
			{plugin.settings.moodRatingLabelDict[2]}
			{plugin.settings.moodRatingLabelDict[3]}
			{plugin.settings.moodRatingLabelDict[4]}
			{plugin.settings.moodRatingLabelDict[5]}
		</div>
	</div>

	<div>
		<button on:click={save}>Save</button>
	</div>
</div>

<style>
	.labels-aligned div {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
</style>
