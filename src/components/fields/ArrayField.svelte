<script>
	import Sortable from 'sortablejs'
	import { onMount } from "svelte";
	import { Dropdown, DropdownItem } from 'flowbite-svelte';
    export let collection;
    export let field;

	let foo;

	export let stages = [
		{ id: 1, name: 'Antifaces de semillas' },
		{ id: 2, name: 'Sacos de semillas' },
		{ id: 3, name: 'Zapatillas térmicas' },
	];

	onMount(async function() {
		Sortable.create(foo, {
			group: 'foo',
			animation: 100,
		});
	});

	function arrayMove(orig, fromIndex, toIndex) {
		let arr = JSON.parse(JSON.stringify(orig));
		var element = arr[fromIndex];
		arr.splice(fromIndex, 1);
		arr.splice(toIndex, 0, element);
		return arr;
	}

	const sort = (e) => {
		let newStages = arrayMove(
			[...stages],
			e.oldIndex,
			e.newIndex
		);
		stages= newStages;
	};

	const addItem = (e) => {
		const newLength = stages.length+1
		const newItem = {
			id: newLength,
			name: 'Elemento ' + newLength
		}

		stages = [...stages, newItem];
	}

	const handleMoveUp = (index) => {
		if (index > 0) {
			const newStages = [...stages];
			[newStages[index - 1], newStages[index]] = [newStages[index], newStages[index - 1]];
			stages = newStages;
		}
	}

	const handleMoveDown = (index) => {
		if (index < stages.length - 1) {
			const newStages = [...stages];
			[newStages[index], newStages[index + 1]] = [newStages[index + 1], newStages[index]];
			stages = newStages;
		}
	}

	const handleDuplicate = (index) => {
		const newLength = stages.length + 1;
		const newItem = {
			id: newLength,
			name: stages[index].name + ' (Copia)'
		}
		const newStages = [...stages.slice(0, index + 1), newItem, ...stages.slice(index + 1)];
		stages = newStages;
	}

	const handleDelete = (index) => {
		const newStages = [...stages.slice(0, index), ...stages.slice(index + 1)];
		stages = newStages;
	}
</script>

<div class="array-field flex flex-col gap-4">
	<div>
		<button on:click={addItem} type="button" class="inline-flex items-center justify-center w-1/2 px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" style="background: #111;padding: .75rem 1.5rem;">
			<svg class="w-5 h-5 mr-2 -ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"></path></svg>
			Añadir elemento
		</button>
	</div>
	<div class="array-field-drag-panel accordion flex flex-col gap-3">
		{#each stages as stage, index (stage.id) }
		<details class="accordion-item">
			<summary class="accordion-item-summary">
				<div class="flex flex-auto items-center gap-5 justify-between">
					<div class="flex items-center gap-5 first">
						<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" width="512" height="512" x="0" y="0" viewBox="0 0 24 24" style="width: 24px;height: 24px;fill: #505050;cursor: grab;" xml:space="preserve" class=""><g><circle cx="8" cy="4" r="2" opacity="1" class=""></circle><circle cx="8" cy="12" r="2" opacity="1" class=""></circle><circle cx="8" cy="20" r="2" opacity="1" class=""></circle><circle cx="16" cy="4" r="2" opacity="1" class=""></circle><circle cx="16" cy="12" r="2" opacity="1" class=""></circle><circle cx="16" cy="20" r="2" opacity="1" class=""></circle></g></svg>
						{stage.name}
					</div>

					<div class="accordion-item-summary-actions flex gap-2 last">
						<button class="more transform rotate-90" type="button">
							<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
						</button>

						<Dropdown class="dropdown-panel">
							<DropdownItem on:click={() => handleMoveUp(index)} class="dropdown-panel-item">Mover arriba</DropdownItem>
							<DropdownItem on:click={() => handleMoveDown(index)} class="dropdown-panel-item">Mover abajo</DropdownItem>
							<DropdownItem on:click={() => handleDuplicate(index)} class="dropdown-panel-item">Duplicar</DropdownItem>
							<DropdownItem on:click={() => handleDelete(index)} class="dropdown-panel-item">Eliminar</DropdownItem>
						</Dropdown>

						<span class="expand">
							<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M24 24H0V0h24v24z" fill="none" opacity=".87"/><path d="M15.88 9.29L12 13.17 8.12 9.29c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0l4.59-4.59c.39-.39.39-1.02 0-1.41-.39-.38-1.03-.39-1.42 0z"/></svg>
						</span>
					</div>
				</div>
			</summary>

			<article>
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime, corrupti? Doloribus tempora repudiandae consequuntur placeat exercitationem quasi, commodi ipsa odit a impedit assumenda! Earum asperiores neque pariatur, aliquid sint nesciunt.
			</article>
		</details>
		{/each}
	</div>
    <pre>{JSON.stringify(field, null, 4)}</pre>
    <pre>{JSON.stringify(collection, null, 4)}</pre>
</div>

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
		background-color: #0b0b0b;
		border-radius: 8px;
	}

	details article {
		padding: 1.25rem 2rem;
		border-top: 1px solid #171717;
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
