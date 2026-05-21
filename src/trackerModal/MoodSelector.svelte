<script>
	import { createEventDispatcher, onMount, tick } from "svelte";

	export let moodSections = [];
	export let activeMoods = [];
	export let collapseSectionsByDefault = false;

	const dispatch = createEventDispatcher();

	let filterInput;
	let filterText = "";
	let collapsedSectionIds = new Set();
	let hasAppliedDefaultCollapse = false;

	$: normalizedFilter = filterText.trim().toLowerCase();
	$: if (
		collapseSectionsByDefault &&
		!hasAppliedDefaultCollapse &&
		moodSections.length > 0
	) {
		collapsedSectionIds = new Set(
			moodSections.map((moodSection, index) =>
				getSectionKey(moodSection, index),
			),
		);
		hasAppliedDefaultCollapse = true;
	}
	$: visibleMoodSections = moodSections
		.map((moodSection, index) => {
			const emotions = moodSection.emotions || [];
			const sectionKey = getSectionKey(moodSection, index);

			return {
				...moodSection,
				emotions,
				sectionIndex: index,
				sectionKey,
				collapsed: collapsedSectionIds.has(sectionKey) && !normalizedFilter,
				visibleEmotions: normalizedFilter
					? emotions.filter((mood) =>
							mood.toLowerCase().includes(normalizedFilter),
					  )
					: emotions,
			};
		})
		.filter(
			(moodSection) =>
				!normalizedFilter || moodSection.visibleEmotions.length > 0,
		);

	onMount(async () => {
		await tick();
		filterInput?.focus();
	});

	function getSectionKey(moodSection, index) {
		return moodSection.id || `${moodSection.name}-${index}`;
	}

	function getSectionName(moodSection, index) {
		return moodSection.name?.trim() || `Emotion group ${index + 1}`;
	}

	function toggleSection(sectionKey) {
		const nextCollapsedSectionIds = new Set(collapsedSectionIds);

		if (nextCollapsedSectionIds.has(sectionKey)) {
			nextCollapsedSectionIds.delete(sectionKey);
		} else {
			nextCollapsedSectionIds.add(sectionKey);
		}

		collapsedSectionIds = nextCollapsedSectionIds;
	}

	function toggleMood(mood) {
		dispatch("toggleMood", { mood: mood });
		moodSections = moodSections;
	}

	function handleMoodKeydown(event, mood) {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			toggleMood(mood);
		}
	}
</script>

<div class="mood-selector">
	<input
		bind:this={filterInput}
		bind:value={filterText}
		class="mood-filter"
		type="search"
		placeholder="Filter emotions"
		autocomplete="off"
		spellcheck="false"
		aria-label="Filter emotions"
	/>

	{#if visibleMoodSections.length > 0}
		<div class="mood-sections">
			{#each visibleMoodSections as moodSection (moodSection.sectionKey)}
				<section class="mood-section">
					<button
						type="button"
						class="mood-section-header"
						style="border-color: {moodSection.color};"
						aria-expanded={!moodSection.collapsed}
						on:click={() => toggleSection(moodSection.sectionKey)}
					>
						<span class="mood-section-toggle">
							{moodSection.collapsed ? "+" : "-"}
						</span>
						<span class="mood-section-name">
							{getSectionName(moodSection, moodSection.sectionIndex)}
						</span>
						<span class="mood-section-count">
							{normalizedFilter
								? `${moodSection.visibleEmotions.length}/${moodSection.emotions.length}`
								: moodSection.emotions.length}
						</span>
					</button>

					{#if !moodSection.collapsed}
						<div class="mood-section-items">
							{#each moodSection.visibleEmotions as mood}
								<span
									role="button"
									tabindex="0"
									on:click={() => toggleMood(mood)}
									on:keydown={(event) => handleMoodKeydown(event, mood)}
									class="mood-item"
									class:active={activeMoods.includes(mood)}
									style="border-color: {moodSection.color}; background-color: {moodSection.color}"
								>
									{mood}
								</span>
							{/each}
						</div>
					{/if}
				</section>
			{/each}
		</div>
	{:else}
		<div class="mood-filter-empty">No emotions found</div>
	{/if}
</div>

<style>
	.mood-selector {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.mood-filter {
		width: 100%;
	}

	.mood-sections {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.mood-section {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		padding: 3px 0;
	}

	.mood-section-header {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		width: 100%;
		padding: 4px 6px;
		border-left: 3px solid;
		text-align: left;
		cursor: pointer;
	}

	.mood-section-toggle {
		width: 1rem;
		text-align: center;
	}

	.mood-section-name {
		flex: 1;
		font-weight: 600;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.mood-section-count {
		color: var(--text-muted);
		font-size: var(--font-ui-smaller);
	}

	.mood-section-items {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		padding: 2px 0;
	}

	.mood-item {
		margin: 3px;
		padding: 5px;
		border-radius: var(--radius-s);
		border: 1px solid;
		cursor: pointer;
		filter: opacity(60%);
	}

	.mood-item:not(.active):not(:hover):not(:focus) {
		background-color: var(--modal-background) !important;
	}

	.mood-item.active,
	.mood-item:hover,
	.mood-item:focus {
		filter: opacity(100%);
		border: 1px solid;
		box-shadow: var(--shadow-s);
	}

	.mood-filter-empty {
		color: var(--text-muted);
		padding: 0.5rem;
		text-align: center;
	}
</style>
