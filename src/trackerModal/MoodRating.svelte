<script>
	import { createEventDispatcher } from 'svelte';
    
    export let emoji = '';
    export let title = '';
    export let rating;
    export let activeRating;
    export let fontSize;
    
    $: isActive = activeRating === Number(rating);

	const dispatch = createEventDispatcher();

    
	function setRating() {
        dispatch('setRating', {
            rating: Number(rating)
		});1
	}
</script>

<span style="font-size: {fontSize + 'rem'}" class:active="{isActive === true}" title={title} on:click={setRating} on:keypress={setRating}>{emoji}</span>

<style>
    span {
        margin: 5px;
        transition: border 0.2s;
        border-radius: var(--radius-s);
        border: 1px solid;
        border-color: transparent;
    }

    span:hover, span.active {
        cursor: pointer;
        border-color: var(--text-faint);
        background-color: var(--color-base-40);
    }
</style>