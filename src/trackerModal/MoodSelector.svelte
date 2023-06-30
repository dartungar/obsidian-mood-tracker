<script>
	import { createEventDispatcher } from 'svelte';
	import { each } from 'svelte/internal';
    
    export let moodSections;
    export let activeMoods;

    const dispatch = createEventDispatcher();

    function toogleMood(mood) {
        dispatch('toggleMood', {mood: mood});
        moodSections = moodSections;
    }

</script>

<div class="mood-selector">
    {#each moodSections as moodSection}
    <div class="mood-section">
        {#each moodSection.emotions as mood}
            <span 
            on:click={(e) => toogleMood(mood)} 
            on:keypress={(e) => toogleMood(mood)} 
            class="mood-item"
            class:active={activeMoods.includes(mood)}
            style="border-color: {moodSection.color}; background-color: {moodSection.color}"
            >
                {mood}            
            </span>
        {/each}
    </div>
    {/each}
</div>

<style>

    .mood-section {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        padding: 5px 0;
    }

    .mood-item {
        margin: 3px;
        padding: 5px;
        border-radius: var(--radius-s);
        border: 1px solid; 
        cursor: pointer;
        filter: opacity(60%);
    }
    
    :not(.mood-item.active, .mood-item:hover) {
        background-color: var(--modal-background) !important;
    }

    .mood-item.active, .mood-item:hover {
        filter: opacity(100%);
        border: 1px solid;
        box-shadow: var(--shadow-s);
    }
</style>