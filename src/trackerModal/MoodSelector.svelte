<script>
	import { createEventDispatcher } from 'svelte';
	import { each } from 'svelte/internal';
    
    export let moods;
    export let activeMoods;

    const dispatch = createEventDispatcher();

    function toogleMood(mood) {
        dispatch('toggleMood', {mood: mood});
        console.log(activeMoods);
        moods = moods;
    }

</script>

<div class="mood-selector">
    {#each moods as mood}
        <span 
        on:click={(e) => toogleMood(mood)} 
        on:keypress={(e) => toogleMood(mood)} 
        class="mood-item"
        class:active={activeMoods.includes(mood)}
        >
            {mood}
        </span>
    {/each}
</div>

<style>
    .mood-selector {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
    }

    .mood-item {
        margin: 5px;
        padding: 5px;
        border-radius: var(--radius-s);
        border: 1px solid var(--text-muted);
    }

    .mood-item.active, .mood-item:hover {
        background-color: var(--color-base-40);
    }
</style>