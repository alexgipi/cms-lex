<script>
  import { Button, Modal } from "flowbite-svelte";
  
  export let multiple = false;
  export let identity = null;

  import { createEventDispatcher } from 'svelte';
  import { UPLOADS_URL, API_URL } from "../consts.mjs";

  const dispatch = createEventDispatcher();


  let modalOpened = false;
  let docs = [];
  let token = null;

  if(identity){
    token = identity.token;
  }

  async function init() {
    docs = await getMediaDocs();
  }

  function handleClick() {
    modalOpened = true;
  }

  async function getMediaDocs() {
    try {
      const res = await fetch(API_URL + "media", 
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      const data = await res.json();

      return data;
    } catch (error) {
      console.error(error);
    }
  }

  init();

  let miElemento;

  let selectedDocs = [];
  let activeDoc = null;

  function selectDoc(event, doc){

    const exists = selectedDocs.findIndex((sd) => sd._id == doc._id) === -1 ? false : true;

    const ctrlPressed = event.ctrlKey;


    if(exists){
        
        if(activeDoc._id === doc._id){
           selectedDocs = selectedDocs.filter(sDoc => sDoc._id !== doc._id);
           activeDoc = selectedDocs[selectedDocs.length - 1]
        } else {
          activeDoc = doc;
        }
        
    } else {        
        
        if (ctrlPressed && multiple) {
          // alert('Tecla Control presionada al hacer clic');
          selectedDocs = [... selectedDocs, doc]
          
        } else {
          // alert('Clic sin la tecla Control');
          selectedDocs = [doc]
        }

        activeDoc = doc;
    }

    console.log(selectedDocs)
  }

  function handleSelect() {
    alert(selectedDocs.length + ' imagenes seleccionadas')
    dispatch('select', selectedDocs);
  }
</script>

<button 
  type="button" 
  on:click={handleClick}
  class="text-white bg-[#111] hover:bg-[#222] focus:ring-4 focus:ring-zinc-900 font-medium rounded-lg text-sm px-5 py-3 focus:outline-none"
  >
    Abrir galería de medios
</button>

<Modal
  title="Galería de medios"
  bind:open={modalOpened}
  size="xxl"
  autoclose
  outsideclose
  bodyClass="p-0"
  class="media-modal dark:bg-zinc-800 dark:text-zinc-400 rounded-xl"
  backdropClass="fixed inset-0 z-40 bg-zinc-900 bg-opacity-50 backdrop-blur-sm dark:bg-opacity-80"
>
  <div class="flex h-full">
    <div class="overflow-auto p-5">
      <div class="grid grid-cols-2 md:grid-cols-7 gap-5">
        {#each docs as doc}
          <li
          id={doc._id}
          on:click={ (e) => selectDoc(e,doc)}
            tabindex="0"
            class="list-none gallery-item rounded-lg relative aspect-square"
            class:selected={selectedDocs.findIndex((sd) => sd._id == doc._id) === -1 ? false : true}
            class:active={activeDoc?._id === doc._id}
          >

            <header class="gallery-item-header">
                <input
                    checked={selectedDocs.findIndex((sd) => sd._id == doc._id) === -1 ? false : true}
                    id="x"
                    name="categories"
                    type="checkbox"
                    class="text-violet-500 w-5 h-5 bg-zinc-100 border-zinc-300 rounded focus:ring-violet-500 dark:focus:ring-violet-600 dark:ring-offset-zinc-700 dark:focus:ring-offset-zinc-700 focus:ring-2 dark:bg-zinc-600 dark:border-zinc-500"
                />
            </header>
            <img
            class="h-auto max-w-full rounded-lg"
            src={UPLOADS_URL + 'thumbnail/' + doc.file}
            alt=""
            />

          </li>
        {/each}
      </div>
    </div>

    <div class="media-info p-5">
      {#if activeDoc?._id}
      <h3>Media info</h3>
      <div class="attachment-info">
        <div class="thumbnail thumbnail-image">
          <img
            src={UPLOADS_URL + 'thumbnail/' + activeDoc?.file}
            draggable="false"
            alt=""
          />
        </div>

        <div class="details">
          <small class="filename text-white">{activeDoc?.file}</small>

          <div class="details-item uploaded">{activeDoc?.createdAt}</div>

          <div class="details-item file-size">152 KB</div>

          <div class="details-item dimensions">1200 por 744 píxeles</div>

          <div class="details-actions">
            <a
              class="edit-attachment"
              href={"/admin/media/" + activeDoc?._id}
              target="_blank">Editar la imagen</a
            >

            <button type="button" class="text-red-400 button-link delete-attachment">
              Borrar permanentemente
            </button>
          </div>

        </div>
      </div>
      {/if}
    </div>
  </div>

  <svelte:fragment slot="footer">
    <div class="flex w-full justify-between">
      <div>
        {#if multiple}
          <div class="multiple-field-info" style="display: flex;align-items: center;gap: 8px;font-size: 0.9em;color: #8f8f8f;">
            Info: Manten la tecla 
            <kbd style="padding: 0 8px;background: #3a3a3a;border-radius: 5px;box-shadow: 1px 1px #494949;">
              Ctrl
            </kbd> 
            para selección múltiple.
          </div>
        {/if}
      </div>

      <div>
        <Button color="dark">Cancelar</Button>
        <Button on:click={handleSelect} color="purple"
          >Seleccionar</Button
        >
      </div>
    </div>
  </svelte:fragment>
</Modal>

<style>
  .media-modal-body {
    padding: 0;
  }

  .gallery-item {
    position: relative;
    outline: none;
  }

  .gallery-item input {
    opacity: 0;
  }

  .gallery-item input:focus {
    opacity: 1;
  }

  .gallery-item.selected input {
    opacity: 1;
    color: #7e3af2;
  }

  
  .gallery-item-header {
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    align-items: center;
    padding: 10px;
    width: 100%;
  }

  .gallery-item img {
    height: 100%;
    object-fit: none;
  }

  .gallery-item:focus {
    box-shadow: 0 0 0 4px #27272a, 0 0 0 5px #515151;
  }

  .gallery-item.selected {
    box-shadow: 0 0 0 4px #27272a, 0 0 0 5px #7e3af2;
  }

  .gallery-item.active {
    box-shadow: 0 0 0 5px #7e3af2;
  }

  

  .gallery-item.active input {
    color: #7e3af2;
  }

  .media-info {
    width:100%;
    max-width: 340px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .thumbnail.thumbnail-image {
    margin-bottom: 1rem;
  }

  .details {
    font-size: 0.96rem;
    
  }

  .details .edit-attachment {
    color: #a3a3a3;
  }

  .details-item {
    color: #919191;
  }

  .details-actions {
    margin-top: 10px;
    display: flex;
    gap: 1rem;
  }

  .details .filename {
    display: inline-block;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    width: 100%;
  }
</style>
