<script>
	import { createEventDispatcher } from 'svelte'

	import { Dropdown, DropdownItem } from 'flowbite-svelte';
    export let stage;
    export let field;
	export let index;

	const dispatch = createEventDispatcher()

	const handleMoveUp = (e) => {
		dispatch('moveUp', {stage, index})
		dropdownOpen = false;
	}

	const handleMoveDown = (e) => {
		dispatch('moveDown', {stage, index})
		dropdownOpen = false;
	}

	const handleDuplicate = (e) => {
		dispatch('duplicate', {stage, index})
		dropdownOpen = false;
	}

	let element;
	const handleDelete = (e) => {
		dispatch('deleteMe', {stage, index})
		dropdownOpen = false;
	}

	let dropdownOpen = false;
</script>

<details  bind:this={element} class="accordion-item">
    <summary class="accordion-item-summary">
        <div class="flex flex-auto items-center gap-5 justify-between">
            <div class="flex items-center gap-5 first">
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" x="0" y="0" viewBox="0 0 24 24" style="width: 24px;height: 24px;fill: #505050;cursor: grab;" xml:space="preserve" class=""><g><circle cx="8" cy="4" r="2" opacity="1" class=""></circle><circle cx="8" cy="12" r="2" opacity="1" class=""></circle><circle cx="8" cy="20" r="2" opacity="1" class=""></circle><circle cx="16" cy="4" r="2" opacity="1" class=""></circle><circle cx="16" cy="12" r="2" opacity="1" class=""></circle><circle cx="16" cy="20" r="2" opacity="1" class=""></circle></g></svg>
                {stage?.[field?.useAsTitle] || 'Element ' + (index+1)}
            </div>

            <div class="accordion-item-summary-actions flex gap-2 last">
                <button class="more transform rotate-90" type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
                </button>

                <Dropdown bind:open={dropdownOpen} class="dropdown-panel">
                    <DropdownItem on:click={(e) => handleMoveUp(e)} class="dropdown-panel-item">Mover arriba</DropdownItem>
                    <DropdownItem on:click={(e) => handleMoveDown(e)} class="dropdown-panel-item">Mover abajo</DropdownItem>
                    <DropdownItem on:click={(e) => handleDelete(e)} class="dropdown-panel-item">Eliminar</DropdownItem>
                </Dropdown>

                <span class="expand">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M24 24H0V0h24v24z" fill="none" opacity=".87"/><path d="M15.88 9.29L12 13.17 8.12 9.29c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0l4.59-4.59c.39-.39.39-1.02 0-1.41-.39-.38-1.03-.39-1.42 0z"/></svg>
                </span>
            </div>
        </div>
    </summary>

    <article>
        <slot></slot>
    </article>
</details>

<style>
	summary {
		list-style: none;
		display: flex;
		gap: .5rem;
		justify-content: space-between;
		align-items: center;
		padding: 1.25rem 2rem;
		font-weight: 500;
		color: #e8e8e8;
	}

	summary::-webkit-details-marker {
		display: none;
	}

	details[open] > summary .expand {
		transform: rotate(180deg);
	}

	details {
		background-color: #1010104a;
		border-radius: 8px;
		border: 1px solid #4646461c;
	}

	details article {
		padding: 1.25rem 2rem;
		border-top: 1px solid #171717;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.accordion-item-summary-actions {
		& .more, & .expand {
			color: #eee;
			cursor: pointer;
		}
		& .expand {
			transition: transform 0.2s ease-in;
		}
	}

	:global(.dropdown-panel) {
		overflow: hidden;
		background: #101010;
		border-radius: 5px;
	}

	:global(.dropdown-panel-item:hover) {
		background-color: #131313 !important;
	}
</style>
