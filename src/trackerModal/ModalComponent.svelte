<script lang="ts">
	import store from "src/store";
	import MoodTrackerPlugin from "../main";
    import MoodRating from "./MoodRating.svelte";
	import MoodSelector from "./MoodSelector.svelte";

    let plugin: MoodTrackerPlugin | undefined = undefined;

    store.plugin.subscribe((p) =>  {
        this.plugin = p;
        console.log("plugin from store and in component", p, plugin);
    });

    
    // modal state
    let moods = this.plugin?.settings.moods ?? [];
    let activeMoodRating: number;
    let activeMoods: string[] = [];
    let note = "";

    console.log("moods in component", moods);

    function handleSetRating(event: any) {
        activeMoodRating = event.detail.rating;
    }

    function handleToggleMood(event: any) {
        console.log("handleToggleMood", event.detail.mood);
        if (activeMoods.includes(event.detail.mood)) {
            activeMoods = activeMoods.filter((m) => m !== event.detail.mood);
        } else {
            activeMoods.push(event.detail.mood);
        }

        console.log("activeMoods in parent", activeMoods);
    }

</script>
  
<div class="modal-inner-container">
    
    <div class="mood-rating-container"> 
        <h3>How are you feeling?</h3>
        <!-- TODO: set emoji in settings -->
        <MoodRating emoji="😨" title="very bad" rating="1" on:setRating={handleSetRating}  bind:activeRating={activeMoodRating}/>
        <MoodRating emoji="☹️" title="bad" rating="2"  on:setRating={handleSetRating}  bind:activeRating={activeMoodRating}/>
        <MoodRating emoji="😐" title="ok" rating="3"  on:setRating={handleSetRating}  bind:activeRating={activeMoodRating}/>
        <MoodRating emoji="🙂" title="good" rating="4"  on:setRating={handleSetRating}  bind:activeRating={activeMoodRating}/>
        <MoodRating emoji="😊" title="very good" rating="5" on:setRating={handleSetRating}  bind:activeRating={activeMoodRating} />
    </div>
    
    <div class="feelings-container">
        <h3>What are you feeling?</h3>
        <MoodSelector on:toggleMood={handleToggleMood} bind:activeMoods={activeMoods} moods={moods} />
    </div>
    <div class="note-container">
        <textarea class="note" placeholder="add a note about what you feel (optional)" bind:value={note}></textarea>
    </div>
    <!-- TODO: save button -->
    <div><button on:click={() => console.log(activeMoodRating, activeMoods, note)}>Save</button></div>
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
    }
</style>