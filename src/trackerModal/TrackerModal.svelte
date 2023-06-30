<script lang="ts">
	import store from "src/store";
	import MoodTrackerPlugin from "../main";
    import MoodRating from "./MoodRating.svelte";
	import MoodSelector from "./MoodSelector.svelte";
	import { MoodTrackerEntry } from "src/entities/MoodTrackerEntry";
	import { EmotionSection } from "src/entities/IEmotionSection";

    let plugin: MoodTrackerPlugin;
    let moodSections: EmotionSection[]= [];
    let moodRatingLabelDict: { [key: number]: string } = {};

    store.plugin.subscribe((p) => {
        moodSections = p.settings.emotionSections;
        plugin = p;
        moodRatingLabelDict = p.settings.moodRatingLabelDict;
    });
    

    // modal state
    let activeMoodRating: number = 3;
    let activeMoods: string[] = [];
    let note = "";

    function handleSetRating(event: any) {
        activeMoodRating = event.detail.rating;
    }

    function handleToggleMood(event: any) {
        if (activeMoods.includes(event.detail.mood)) {
            activeMoods = activeMoods.filter((m) => m !== event.detail.mood);
        } else {
            activeMoods.push(event.detail.mood);
        }

    }

    async function saveEntry() {
        var entry = new MoodTrackerEntry(activeMoodRating, activeMoods, note);
        await plugin!.addEntry(entry);
        closeModalFunc();
    }

    export let closeModalFunc: () => void;

</script>
  
<div class="modal-inner-container">
    <h3>How are you feeling?</h3>
    <div class="mood-rating-container"> 
        <MoodRating emoji={moodRatingLabelDict[1]} title="very bad" rating="1" on:setRating={handleSetRating}  bind:activeRating={activeMoodRating}/>
        <MoodRating emoji={moodRatingLabelDict[2]} title="bad" rating="2"  on:setRating={handleSetRating}  bind:activeRating={activeMoodRating}/>
        <MoodRating emoji={moodRatingLabelDict[3]} title="ok" rating="3"  on:setRating={handleSetRating}  bind:activeRating={activeMoodRating}/>
        <MoodRating emoji={moodRatingLabelDict[4]} title="good" rating="4"  on:setRating={handleSetRating}  bind:activeRating={activeMoodRating}/>
        <MoodRating emoji={moodRatingLabelDict[5]} title="very good" rating="5" on:setRating={handleSetRating}  bind:activeRating={activeMoodRating} />
    </div>
    
    <div class="feelings-container">
        <MoodSelector on:toggleMood={handleToggleMood} bind:activeMoods={activeMoods} moodSections={moodSections} />
    </div>
    <div class="note-container">
        <textarea class="note" placeholder="add a note about what you feel (optional)" bind:value={note}></textarea>
    </div>
    <!-- TODO: save button -->
    <div><button on:click={saveEntry}>Save</button></div>
</div>
  
<style>
    .modal-inner-container>div{
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
        border: 1px solid var(--background-modifier-border)
    }
</style>