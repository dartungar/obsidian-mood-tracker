<script lang="ts">
	import { EmotionGroup } from "src/entities/IEmotionGroup";
	import MoodTrackerPlugin from "src/main";
	import store from "src/store";
	import { t } from "src/i18n";

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
		<div  class="mv-5">
			<label for="veryGood">{t("moodRatings.veryGood")}</label>
			<input
				id="veryGood"
				type="text"
				bind:value={plugin.settings.moodRatingLabelDict[5]}
			/>
		</div>
		<div class="mv-5">
			<label for="good">{t("moodRatings.good")}</label>
			<input
				id="good"
				type="text"
				bind:value={plugin.settings.moodRatingLabelDict[4]}
			/>
		</div>
		<div class="mv-5">
			<label for="ok">{t("moodRatings.ok")}</label>
			<input
				id="ok"
				type="text"
				bind:value={plugin.settings.moodRatingLabelDict[3]}
			/>
		</div>
		<div class="mv-5">
			<label for="bad">{t("moodRatings.bad")}</label>
			<input
				id="bad"
				type="text"
				bind:value={plugin.settings.moodRatingLabelDict[2]}
			/>
		</div>
		<div class="mv-5">
			<label for="veryBad">{t("moodRatings.veryBad")}</label>
			<input
				id="veryBad"
				type="text"
				bind:value={plugin.settings.moodRatingLabelDict[1]}
			/>
		</div>
		<div  class="mv-5">
			<label for="size"
				>{t("modals.moodRatingLabels.labelSize")}: {plugin.settings.moodRatingLabelSize} rem</label
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

	<div class="mv-5">
		<div>{t("modals.moodRatingLabels.preview")}:</div>
		<div style="font-size: {plugin.settings.moodRatingLabelSize + 'rem'}">
			{plugin.settings.moodRatingLabelDict[1]}
			{plugin.settings.moodRatingLabelDict[2]}
			{plugin.settings.moodRatingLabelDict[3]}
			{plugin.settings.moodRatingLabelDict[4]}
			{plugin.settings.moodRatingLabelDict[5]}
		</div>
	</div>

	<div>
		<button on:click={save}>{t("modals.moodRatingLabels.save")}</button>
	</div>
</div>

<style>
	.labels-aligned div {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		
	}

	.mv-5 {
		margin: 5px 0;
	}
</style>
