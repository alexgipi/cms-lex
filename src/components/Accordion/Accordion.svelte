

  <script>
	import Sortable from "sortablejs";
	import { onMount } from 'svelte';
	import AccordionItem from './AccordionItem.svelte';
	
	export let collection;
	export let field;
	export let stages;
	export let itemIndex;
	export let parentName;

	console.log({stages})

	let foo;

	let elementData = [];

	async function loadElementData(stage, index) {
		try {
			const data = await getElement(stage, index);
			elementData = [...elementData, data]; // Reasignar elementData
		} catch (error) {
			console.error(error);
		}
	}

    async function initialize() {
        // Esperar a que todas las llamadas a loadElementData() se completen
        await Promise.all(stages.map((stage, index) => loadElementData(stage, index)));
    }

    // Llamar a initialize() cuando el componente se monte

	onMount(async function () {
		initialize()
		Sortable.create(foo, {
		group: {
			name: "foo",
			put: true,
			// 				pull: false,
		},
		animation: 200,
		});
	});

	async function handleClick(e) {
		try {
			const formData = new FormData();
			formData.append("length", stages.length);
			formData.append("collection", JSON.stringify(collection));
			formData.append("field", JSON.stringify(field));
			formData.append("parentName", parentName);

			const newStage = {label: "New element " + (stages.length+1)}
			formData.append("stage", JSON.stringify(newStage))

			const res = await fetch("http://localhost:4322/partials/element", {
				method: "POST",
				body: formData,
				// No necesitas configurar contentType aquí
			});

			if (!res.ok) {
				throw new Error(`HTTP error! status: ${res.status}`);
			}
			elementData = [...elementData, await res.text()];
			stages = [...stages, newStage]
		} catch (error) {
			console.error(error);
		}
	}

	async function getElement(stage, index){
		try {
			const formData = new FormData();
			formData.append("length", index);
			formData.append("collection", JSON.stringify(collection));
			formData.append("field", JSON.stringify(field));
			formData.append("parentName", parentName);

			const newStage = stage;
			formData.append("stage", JSON.stringify(newStage))

			const res = await fetch("http://localhost:4322/partials/element", {
				method: "POST",
				body: formData,
				// No necesitas configurar contentType aquí
			});

			if (!res.ok) {
				throw new Error(`HTTP error! status: ${res.status}`);
			}
			return await res.text()
		} catch (error) {
			console.error(error);
		}
	}

	function handleDelete(e){
		const index = e.detail.index;

		const newStages = stages.filter((stage, i) => i !== index);
		stages = newStages;
	}

	const handleMoveUp = (e) => {
		let index = e.detail.index;
		if (index > 0) {
			const newStages = [...stages];
			[newStages[index - 1], newStages[index]] = [newStages[index], newStages[index - 1]];
			stages = newStages;
		}
	}

	const handleMoveDown = (e) => {
		let index = e.detail.index;
		if (index < stages.length - 1) {
			const newStages = [...stages];
			[newStages[index], newStages[index + 1]] = [newStages[index + 1], newStages[index]];
			stages = newStages;
		}
	}

	function arrayMove(orig, fromIndex, toIndex) {
		let arr = JSON.parse(JSON.stringify(orig));
		var element = arr[fromIndex];
		arr.splice(fromIndex, 1);
		arr.splice(toIndex, 0, element);
		return arr;
	}

	const sort = (e) => {
		console.log(e)
		let newStages = arrayMove(
			[...stages],
			e.oldIndex,
			e.newIndex
		);
		stages = newStages;
	};
  </script>
  
  <div>
	<button
	  on:click={handleClick}
	  type="button"
	  class="inline-flex items-center justify-center w-1/2 px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
	  style="background: #111;padding: .75rem 1.5rem;"
	>
	  <svg
	  class="w-5 h-5 mr-2 -ml-1"
	  fill="currentColor"
	  viewBox="0 0 20 20"
	  xmlns="http://www.w3.org/2000/svg"
	  >
	  <path
		fill-rule="evenodd"
		d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
	  />
	  </svg>
	  Añadir elemento
	</button>
  </div>

  <div class="flex flex-col gap-4" on:sort={sort} bind:this={foo}>
	{#each stages as stage, index (stage?.label + index )}
		<AccordionItem 
		on:moveUp={handleMoveUp} 
		on:moveDown={handleMoveDown} 
		on:deleteMe={handleDelete} index={index} stage={stage} field={field}
		>
			{@html elementData[index]}
		</AccordionItem>
		
	{/each}
  </div>
  