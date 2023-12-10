<script>
	import { createEventDispatcher } from 'svelte';
    
    export let emoji = '';
    export let title = '';
    export let rating;
    export let activeRating;
    
    $: isActive = activeRating === Number(rating);

	const dispatch = createEventDispatcher();

    
	function setRating() {
        dispatch('setRating', {
            rating: Number(rating)
		});
	}
</script>

<span class:active="{isActive === true}" title={title} on:click={setRating} on:keypress={setRating}>{emoji}</span>

<style>
    span {
        margin: 5px;
        font-size: 3rem;
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