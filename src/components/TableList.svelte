<script>
  import pluralize from 'pluralize';
  import Sortable from "https://unpkg.com/sortablejs?module";
  import { onMount } from "svelte";

  import { Button, Modal } from 'flowbite-svelte';
  import { ExclamationCircleOutline } from 'flowbite-svelte-icons';
  import { formatDate } from "../../utils";
  import { API_URL } from '../consts.mjs';
  let modalOpened = false;

  export let collectionFields = [];
  export let collection;
  export let collectionName;
  export let documents = [];
  export let identity = null;
  let token;

  let modalDeleteDoc = null;

  let documentsToRender = documents;
  let fieldsToRender = [];  
  let limit = 40;
  let foo;

  if(identity?.token) token = identity.token;

  const localStorageFields = localStorage.getItem(collection);
  
  if(localStorageFields){
    collectionFields = JSON.parse(localStorageFields);
    fieldsToRender = collectionFields;
  }else {
    collectionFields = addField(collectionFields, {name:'_id', active: true}, true);
    collectionFields = addField(collectionFields, {name:'createdAt', type: 'Date'});
    collectionFields = addField(collectionFields, {name:'updatedAt', type: 'Date'});
    
    if(collection === 'users'){
      collectionFields = collectionFields.filter((colField) => {
        return colField.name != 'password'
      })
    }
    console.log(collectionFields)
    fieldsToRender = collectionFields;
    localStorage.setItem(collection, JSON.stringify(collectionFields))
  }

  // $: stages = collectionFields;

  onMount(async function () {
    Sortable.create(foo, {
      group: {
        name: "foo",
        put: true,
        // 				pull: false,
      },
      animation: 200,
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

      let newCollectionFields = arrayMove([...fieldsToRender], e.oldIndex, e.newIndex);
      console.log(newCollectionFields);
      fieldsToRender = newCollectionFields;
      // collectionFields = fieldsToRender;
      localStorage.setItem(collection, JSON.stringify(newCollectionFields));
    
  };

  const title = "Lexgi CMS";

  const urlParams = new URLSearchParams(window.location.search);

  const limitParam = urlParams.get("limit");
  const sortParam = urlParams.get("sort");
  const pageParam = urlParams.get("page");

  if (collection === "settings") {
  } else {
    if (documents.length > 0) {
      if(!localStorageFields){
        const maxKeys = 6;

        collectionFields.forEach((collectionField, i) => {
          if(i <= maxKeys - 1){
            collectionField.active = true;
          }
        });

        localStorage.setItem(collection, JSON.stringify(collectionFields))
      }
      
      // Define el número máximo de claves que deseas obtener
       // Cambia este valor al número máximo deseado
      fieldsToRender = collectionFields;
    } else {
      
    }
  }

  let selectedItems = [];
  let allSelected = false;

  function selectAllHandle(event) {
    allSelected = event.target.checked;

    if (allSelected) {
      selectedItems = documents;
    } else {
      selectedItems = [];
    }
  }

  function selectItem(event, document, docIndex) {
    const { checked } = event.target;

    if (checked) {
      // Si el checkbox está marcado, crea una nueva copia de selectedItems con el elemento agregado
      selectedItems = [...selectedItems, document];
    } else {
      // Si el checkbox está desmarcado, crea una nueva copia de selectedItems sin el elemento
      selectedItems = selectedItems.filter((item) => item._id !== document._id);
    }
  }

  function removeSelectedDocs(){
    selectedItems.forEach(selectedItem => {
        removeDoc(selectedItem._id);
    });
  }

  function addField(collectionFields, field, atStart = false) {
    if (!collectionFields.some(e => e.name === field.name)) {
      if (atStart) {
        collectionFields = [field, ...collectionFields];
      } else {
        collectionFields = [...collectionFields, field];
      }
    }
    return collectionFields;
  }

  function enableFieldHandle(e, field, i){
    const indexColFields = collectionFields.findIndex((fld) => fld.name === field.name);
    const index = fieldsToRender.findIndex((fld) => fld.name === field.name);

    collectionFields[indexColFields].active = true;
    fieldsToRender[index].active = true;

    localStorage.setItem(collection, JSON.stringify(fieldsToRender))
  }

  function disableFieldHandle(e, field, i){
    const indexColFields = collectionFields.findIndex((fld) => fld.name === field.name);
    const index = fieldsToRender.findIndex((fld) => fld.name === field.name);

    collectionFields[indexColFields].active = false;
    fieldsToRender[index].active = false;

    localStorage.setItem(collection, JSON.stringify(fieldsToRender))
  }

  let modalMultipleRemove = false

  function openDeleteModal(doc){
    if(doc) {
      modalDeleteDoc = doc;
    }
    modalOpened = true;
    modalMultipleRemove = false;
  }
  
  function openDeleteMultipleModal(){
    modalOpened = true;
    modalMultipleRemove = true;
  }

  async function removeDocHandle(){
    let idToDelete = modalDeleteDoc._id;

    removeDoc(idToDelete);
    
  }

  async function removeDoc(docId){
    try {
      const res = await fetch(API_URL + collection + '/' + docId, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
        }
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      } else {
        // Eliminar el objeto del array basado en el _id
        documents = documents.filter(doc => doc._id !== docId);
        documentsToRender = documentsToRender.filter(doc => doc._id !== docId);
        selectedItems = selectedItems.filter(doc => doc._id !== docId);
      }

      // const data = await res.json();
      // console.log({data})

      // return data;

    } catch (error) {
      console.error(error);
    }
    
  }
</script>

<header
  class="page-header sticky top-0 z-30 py-6 bg-white block sm:flex items-center justify-between lg:mt-1.5 dark:bg-[#000] dark:border-zinc-700"
>
  <div class="container w-full flex gap-6 justify-between items-center">
    <div class="flex gap-4">
      <h1
        class="text-xl font-semibold text-zinc-900 sm:text-2xl dark:text-white"
      >
        {collectionName}
      </h1>

      {#if collection === 'media'}
        <a
          href={collection + "/create"}
          type="button"
          class="inline-flex items-center justify-center w-1/2 px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        >
          <svg
            class="w-5 h-5 mr-2 -ml-1"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            ><path
              fill-rule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clip-rule="evenodd"></path></svg
          >
            Upload
        </a>
      {:else}
        <a
          href={collection + "/create"}
          type="button"
          class="inline-flex items-center justify-center w-1/2 px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        >
          <svg
            class="w-5 h-5 mr-2 -ml-1"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            ><path
              fill-rule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clip-rule="evenodd"></path></svg
          >
            Add new
        </a>
      {/if}
    </div>

    <div class="flex flex-auto gap-4">
      <div class="sm:flex flex-auto">
        <div class="items-center hidden mb-3 sm:flex sm:mb-0">
          <form class="lg:pr-3" action="/" method="GET">
            <label for="users-search" class="sr-only">Search</label>
            <div class="relative lg:w-64 xl:w-96">
              <input
                type="text"
                name="email"
                id="users-search"
                class="bg-zinc-50 border border-zinc-300 text-zinc-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 px-4 dark:bg-[#000] dark:border-[#1f1f1f] dark:placeholder-[#898989] dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder={"Search for " + collectionName}
              />
            </div>
          </form>

          {#if selectedItems.length > 0}
            <div
              class="flex items-center pl-0 mt-3 space-x-1 sm:pl-2 sm:mt-0"
            >
              <!-- <a
                href="/"
                class="inline-flex justify-center p-1 text-zinc-500 rounded cursor-pointer hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-[#0d0d0d] dark:hover:text-white"
              >
                <svg
                  class="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  ><path
                    fill-rule="evenodd"
                    d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                    clip-rule="evenodd"></path></svg
                >
              </a> -->

              <a
                href="/"
                class="inline-flex justify-center p-1 text-zinc-500 rounded cursor-pointer hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-[#0d0d0d] dark:hover:text-white"
              >
                <svg
                  class="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  ><path
                    d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"
                  ></path><path
                    fill-rule="evenodd"
                    d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                    clip-rule="evenodd"
                  ></path></svg
                >
              </a>

              <button
                on:click={openDeleteMultipleModal}
                class="inline-flex justify-center p-1 text-zinc-500 rounded cursor-pointer hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-[#0d0d0d] dark:hover:text-white"
              >
                <svg
                  class="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  ><path
                    fill-rule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clip-rule="evenodd"
                  ></path></svg
                >
              </button>
            </div>

            <span class="text-sm text-zinc-400 ml-4">{selectedItems.length} Seleccionados</span>
          {/if}
        </div>

        <div class="flex items-center ml-auto space-x-2 sm:space-x-3">
          
        </div>
      </div>
    </div>
  </div>
</header>

{#if (!documents || documents?.length === 0)}
  <div class="no-content-section container">
    <p>No <strong>{collectionName}</strong> found. Either no <span class="capitalize">{collection?.replaceAll('-', ' ')}</span> exist yet or none match the filters you've specified above.</p>
    <a class="btn" href={collection+'/create'}>Create new <span>{pluralize.singular(collectionName)}</span></a>
  </div>
{/if}

{#if documents?.length > 0 }
  <div id="main-content" class="flex flex-col flex-auto">
    <div
    class="container py-7 bg-white block sm:flex items-center justify-between lg:mt-1.5 dark:bg-[#000] dark:border-zinc-700"
    >
      <div class="w-full">
        <div class="flex items-center ml-auto space-x-2 sm:space-x-3">
          <div on:sort={sort} bind:this={foo} class="flex flex-wrap gap-2" id="items">
            {#each collectionFields as field, i}
              <span
                id="badge-dismiss-dark"
                class:opacity-[0.4]={!field.active}
                class="transition-colors cursor-pointer inline-flex items-center px-2 pr-3 py-1 text-sm font-medium text-zinc-800 bg-zinc-100 rounded-[6px] dark:bg-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
              >
              {#if field.active}
                <button
                  on:click={(e) => disableFieldHandle(e, field, i)}
                  type="button"
                  class="transition-colors inline-flex items-center p-1 me-2 text-sm text-[currentColor] bg-transparent rounded-[4px] hover:bg-zinc-400 dark:hover:bg-zinc-600"
                  data-dismiss-target="#badge-dismiss-dark"
                  aria-label="Remove"
                >
                  <svg
                    class="w-2 h-2"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                </button>
                {:else}
                <button
                  on:click={(e) => enableFieldHandle(e, field, i)}
                  type="button"
                  class="transition-colors inline-flex items-center p-1 me-2 text-sm text-[currentColor] bg-transparent rounded-[4px] hover:bg-zinc-400 dark:hover:bg-zinc-600"
                  data-dismiss-target="#badge-dismiss-dark"
                  aria-label="Remove"
                >
                  <svg
                    class="w-[10px] h-[10px]"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 18 18"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 1v16M1 9h16"
                    ></path>
                  </svg>
                </button>
              {/if}
                {field.name}
              </span>
            {/each}
          </div>
        </div>
      </div>
    </div>

    <div class="overflow-hidden shadow flex-auto flex flex-col">
      <div class="container flex flex-col flex-auto">
        <div class="overflow-x-auto">
          <div class="inline-block min-w-full align-middle">
            
            <table
              class="rounded-lg shadow overflow-hidden min-w-full divide-y divide-zinc-200 table-fixed dark:divide-[#111]"
            >
              <thead class="bg-zinc-100 dark:bg-[#111]">
                <tr>
                  <th scope="col" class="p-6 pr-4">
                    <div class="flex items-center">
                      <input
                        on:change={selectAllHandle}
                        id="checkbox-all"
                        aria-describedby="checkbox-1"
                        type="checkbox"
                        class="w-4 h-4 border-zinc-300 rounded bg-zinc-50 focus:ring-3 focus:ring-primary-300 dark:focus:ring-[#9948ff] dark:focus:ring-offset-[#000] dark:text-[#9948ff] dark:ring-offset-zinc-800 dark:bg-zinc-700 dark:border-zinc-600"
                      />
                      <label for="checkbox-all" class="sr-only">checkbox</label>
                    </div>
                  </th>

                  {#if fieldsToRender}
                    {#each fieldsToRender as field, i}
                      {#if field?.active}
                        <th
                          scope="col"
                          class="p-3 text-xs font-medium text-left text-zinc-500 uppercase dark:text-zinc-400"
                        >
                          <span class="sort-column__label capitalize"
                            >{field.name || "--"}</span
                          >
                        </th>
                      {/if}
                    {/each}
                  {/if}

                  <th
                    scope="col"
                    class="p-3 text-xs font-medium text-left text-zinc-500 uppercase dark:text-zinc-400"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody
                class="bg-white divide-y divide-zinc-200 dark:bg-[#090909] dark:divide-[#111]"
              >
                {#each documentsToRender as document, i}
                  <tr class="hover:bg-zinc-100 dark:hover:bg-[#0d0d0d]">
                    <td class="w-4 p-6 pr-4">
                      <div class="flex items-center">
                        <input
                          checked={allSelected}
                          on:change={(e) => selectItem(e, document, i)}
                          id="checkbox-id"
                          aria-describedby="checkbox-1"
                          type="checkbox"
                          class="w-4 h-4 border-zinc-300 rounded bg-zinc-50 focus:ring-3 focus:ring-primary-300 dark:focus:ring-[#9948ff] dark:focus:ring-offset-[#000] dark:text-[#9948ff] dark:ring-offset-zinc-800 dark:bg-zinc-700 dark:border-zinc-600"
                        />
                        <label for="checkbox-id" class="sr-only">
                          checkbox
                        </label>
                      </div>
                    </td>

                    {#if fieldsToRender}
                      {#each fieldsToRender as key, index}
                        {#if key?.active}
                        <td
                          class="max-w-lg p-3 text-base font-normal text-zinc-500 dark:text-zinc-400"
                        >
                          <div
                            class="min-w-[85px] text-base font-normal text-balance text-zinc-500 text-sm"
                          >
                            {#if key.type === "array"}
                              {#each document[key.name] as item, index}
                                <div class="truncate">{item}</div>
                              {/each}
                            {:else if key.type === "image"}
                              <div class="flex gap-2">
                                {#if document[key.name] === null}
                                  <img
                                    class="rounded-lg w-[80px] h-[60px] object-cover"
                                    alt="Imágen"
                                    src={'/image-icon.svg'}
                                  />
                                {:else}
                                  {#if key?.relationTo === undefined}
                                    <img
                                      class="bg-[#fff] rounded-lg w-[80px]"
                                      alt="Imágen"
                                      src={'http://localhost:3500/uploads/thumbnail/' + document[key.name]}
                                    />                                    
                                  {:else}
                                    <img
                                      class="bg-[#fff] rounded-lg w-[80px]"
                                      alt="Imágen"
                                      src={'http://localhost:3500/uploads/thumbnail/' + document[key.name]?.file}
                                    />
                                  {/if}
                                {/if}
                                
                              </div>
                            {:else if key.type === "images"}
                              {#if document[key.name].length > 0}
                                <div  class="flex gap-2 min-w-[140px]">
                                  {#if key?.relationTo != 'undefined'}
                                    <img
                                      class="bg-[#111] max-h-[80px] object-cover rounded-lg w-[80px]"
                                      alt="Imágen"
                                      src={'http://localhost:3500/uploads/thumbnail/' + document[key.name][0].file}
                                    />
                                  {:else}
                                    <img
                                      class="bg-[#111] max-h-[80px] object-cover rounded-lg w-[80px]"
                                      alt="Imágen"
                                      src={'http://localhost:3500/uploads/thumbnail/' + document[key.name][0]}
                                    />
                                  {/if}

                                  {#if document[key.name].length > 1}
                                    <div
                                      class="ml-1 flex items-center justify-center rounded-lg w-[60px]"
                                    >
                                      {document[key.name].length - 1} más
                                    </div>
                                  {/if}
                                </div>
                                {:else}
                                <div class="flex gap-2">
                                  <img
                                      class="rounded-lg w-[80px] h-[60px] object-cover"
                                      alt="Imágen"
                                      src={'/image-icon.svg'}
                                    />
                                </div>                                
                              {/if}
                            {:else if key.type === "relation"}
                              
                              {#if key?.hasMany}
                                <div class="line-clamp-2 max-w-[220px]">
                                  {#each document[key.name] as relationDoc, index}
                                    
                                      {relationDoc?.name || relationDoc?._id}{#if index+1 < document[key.name].length}<span>, </span>{/if}                              
                                    
                                  {/each}
                                </div>
                              {:else}
                                <span class="line-clamp-2">{document[key.name]?._id || '<Sin definir>'}</span>
                              {/if}
                              <!-- <span class="line-clamp-2">{@html document[key.name]}</span> -->
                            {:else}
                              
                              {#if document[key.name] === null || document[key.name] === 'undefined'}
                                <span class="line-clamp-2">{'<Sin definir>'}</span>
                                
                                {:else if key.name === 'createdAt' || key.name === 'updatedAt'}
                                <span class="line-clamp-2">{formatDate(document[key.name])}</span>
                                {:else}
                                <span class="line-clamp-2">{@html document[key.name]}</span>
                              {/if}
                              
                            {/if}
                          </div>
                        </td>
                        {/if}
                      {/each}
                    {/if}

                    <td
                      class="max-w-sm p-3 text-base font-normal text-zinc-500 dark:text-zinc-400"
                    >
                      <div class="flex items-center gap-2">
                        <a
                          href={collection + "/" + document._id}
                          type="button"
                          class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-zinc-500 hover:text-zinc-300 transition-colors rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-[#131313] dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                        >
                          <svg
                            class="w-4 h-4 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"
                            ></path><path
                              fill-rule="evenodd"
                              d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                              clip-rule="evenodd"
                            ></path>
                          </svg>
                          Editar
                        </a>

                        <button
                          on:click={() => openDeleteModal(document)}
                          class="
                          inline-flex 
                          items-center 
                          px-3 
                          py-2 
                          text-sm 
                          font-medium 
                          text-center 
                          text-zinc-500
                          rounded-lg
                          hover:text-red-700
                          transition-colors
                          ease-in-out
                          "
                        >
                          <svg
                            class="w-4 h-4 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clip-rule="evenodd"
                            ></path>
                          </svg>
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
            
          </div>
        </div>
      </div>
    </div>

    <!-- <nav-pagination
        class="container block sticky bottom-0 right-0 items-center w-full p-5 bg-white border-t border-zinc-200 sm:flex sm:justify-between dark:bg-[#000] dark:border-[#111]"
      >
        <div class="flex items-center mb-4 sm:mb-0">
          <a
            href="/"
            class="inline-flex justify-center p-1 text-zinc-500 rounded cursor-pointer hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-[#0d0d0d] dark:hover:text-white"
          >
            <svg
              class="w-7 h-7"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              ><path
                fill-rule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clip-rule="evenodd"
              ></path></svg
            >
          </a>
          <a
            href="/"
            class="inline-flex justify-center p-1 mr-2 text-zinc-500 rounded cursor-pointer hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-[#0d0d0d] dark:hover:text-white"
          >
            <svg
              class="w-7 h-7"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              ><path
                fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              ></path></svg
            >
          </a>
          <span class="text-sm font-normal text-zinc-500 dark:text-zinc-400"
            >Mostrando <span class="font-semibold text-zinc-900 dark:text-white"
              >1 - {limit}</span
            >
            de
            <span class="font-semibold text-zinc-900 dark:text-white"
              >{documentsToRender.length}</span
            ></span
          >
        </div>
        <div class="flex items-center space-x-3">
          <a
            href="/"
            class="inline-flex items-center justify-center flex-1 px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          >
            <svg
              class="w-5 h-5 mr-1 -ml-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              ><path
                fill-rule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clip-rule="evenodd"
              ></path></svg
            >
            Previous
          </a>
          <a
            href="/"
            class="inline-flex items-center justify-center flex-1 px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          >
            Next
            <svg
              class="w-5 h-5 ml-1 -mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              ><path
                fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              ></path></svg
            >
          </a>
        </div>
      </nav-pagination> -->
  </div>
{/if}



<Modal 
bind:open={modalOpened} 
size="xs" 
autoclose 
outsideclose
class="dark:bg-zinc-800 dark:text-zinc-400 rounded-xl"
backdropClass='fixed inset-0 z-40 bg-zinc-900 bg-opacity-50 backdrop-blur-sm dark:bg-opacity-80'
>
  <div class="text-center">
    <ExclamationCircleOutline class="mx-auto mb-4 text-zinc-400 w-12 h-12 dark:text-zinc-200" />
    
    {#if modalMultipleRemove }
      <h3 class="mb-5 text-lg font-normal text-zinc-500 dark:text-zinc-400">Seguro que quieres eliminar {selectedItems.length} elemento/s?</h3>
      <Button on:click={removeSelectedDocs} color="red" class="me-2">Si, estoy seguro</Button>
    {:else}
      <h3 class="mb-5 text-lg font-normal text-zinc-500 dark:text-zinc-400">Seguro que quieres eliminar este elemento?</h3>
      <Button on:click={removeDocHandle} color="red" class="me-2">Si, estoy seguro</Button>
    {/if}
    
    
    <Button color="zinc" class="bg-[#313131] hover:text-zinc-100">No, cancelar</Button>
  </div>
</Modal>

<style>
  input[type="checkbox"] {
    accent-color: #9948ff;
  }

  .page-header {
    border-bottom: 1px solid rgb(255 255 255 / 7%);
    height: 90px;
  }

  .no-content-section {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2rem;
    margin: 3rem 0;

  }

  .no-content-section p {
      font-size: 0.84em;
      color: #a7a7a7;
      margin: 0;
  }

  .btn {
      padding: 12px 24px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      background: #fff;
      color: #000;
      font-weight: 600;
  }
</style>
