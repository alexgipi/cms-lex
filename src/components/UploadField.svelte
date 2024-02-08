<script lang="ts">
    import MediaModal from "./MediaModal.svelte";
    export let identity:any = null;
    export let collection:any = null;
    export let name = '';
    export let multiple = false;
    export let files:any = [];
    export let file:any = null;
    let selectedFiles:any = [];
    let removeFilesIds:any = [];
    let selectedDocs:any = [];
    let selectedDocsIds:any = [];
    let token = null;

    if(identity){
        token = identity.token;
    }

    function handleSelectedMedia(event:any) {
        selectedDocs = event.detail;
        console.log("Selected Docs:", selectedDocs);
        selectedDocs.forEach((sDoc:any) => {
            selectedDocsIds = [...selectedDocsIds,sDoc._id];
            const pushData = {src: 'http://localhost:3500/uploads/' + sDoc.file, id: sDoc._id}

            if(multiple){
                selectedFiles = [...selectedFiles, pushData]
            } else {
                selectedFiles = [pushData]
            }
        });
    }

    if(file){
        console.log(file)
        
        if(collection.slug === 'media') {
            selectedFiles.push({src: 'http://localhost:3500/uploads/' + file, id: file})
        } else {
            selectedFiles.push({src: 'http://localhost:3500/uploads/' + file.file, id: file._id})
        }

    } else if(files && files?.length > 0){
        files.forEach((file:any) => {
            selectedFiles.push({src: 'http://localhost:3500/uploads/' + file.file, id: file._id})
        });
    }

    function handleChange(e:any) {
        const files = e.target.files;
        console.log(files);

        // Solo mantener una cola de archivos si la propiedad multiple es true
        if (multiple) {
            // Crear una nueva cola de archivos
            const newSelectedFiles:any = [];

            Object.values(files).forEach((file:any) => {
                const src = URL.createObjectURL(file);
                const newFile = { src, file };
                console.log(newFile);

                // Agregar el nuevo archivo a la cola
                newSelectedFiles.push(newFile);
            });

            // Agregar la cola a la lista existente si ya hay archivos
            if (selectedFiles.length > 0) {
                selectedFiles = [...selectedFiles, ...newSelectedFiles];
            } else {
                // Si no hay archivos, simplemente asignar la nueva cola
                selectedFiles = newSelectedFiles;
            }

            // Actualizar el input de archivos para reflejar la cola completa
            const input:any = document.getElementById(name);
            if (input) {
                const newFileList = new DataTransfer();
                selectedFiles.forEach((file:any) => {
                    newFileList.items.add(file.file);
                });
                input.files = newFileList.files;
            }
        } else {
            // Si no es múltiple, simplemente asignar los nuevos archivos a selectedFiles
            selectedFiles = Object.values(files).map((file:any) => ({
                src: URL.createObjectURL(file),
                file
            }));
        }
    }


    function removeFileHandle(index:any){
        const file = selectedFiles[index];
        console.log(file)
        if(file?.id){
            console.log('tiene id')
            if(multiple){
                removeFilesIds = [...removeFilesIds, file.id]
            }else {
                removeFilesIds = [...removeFilesIds, file.id]
            }
            
        }

        selectedFiles = selectedFiles.filter((_:any, i:any) => i !== index);

        // Crear un nuevo FileList con los archivos restantes
        const newFileList = new DataTransfer();

        selectedFiles.forEach((file:any) => {
            newFileList.items.add(file.file);
        });

        // Actualizar el input de archivos con el nuevo FileList
        const input:any = document.getElementById(name);
        if (input) {
            input.files = newFileList.files;
        }
    }

    
</script>

{#if collection?.slug !== 'media'}
    <MediaModal multiple={multiple} identity={identity} on:select={handleSelectedMedia}></MediaModal>
{/if}

<div class="upload-field flex items-center justify-center flex-col w-full border-2 border-zinc-300 border-dashed rounded-lg cursor-pointer bg-zinc-50 dark:bg-[#000] hover:bg-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-500">
    <label for={name} class="flex flex-col items-center justify-center w-full rounded-lg cursor-pointer">
        <div class="flex flex-col items-center justify-center pt-6 pb-6">
            <svg class="w-8 h-8 mb-4 text-zinc-500 dark:text-zinc-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
            </svg>
            <p class="mb-2 text-sm text-zinc-500 dark:text-zinc-500"><span class="font-semibold">Click para subir una nueva imagen</span></p>
            <!-- <p class="text-xs text-zinc-500 dark:text-zinc-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p> -->
        </div>
        
        <input on:change={handleChange} name={name} id={name} type="file" class="hidden" multiple={multiple} />
        
    </label>
    <div class="preview-files">
        {#each selectedFiles as file, i}
        <article class="preview-file">
            <header class="preview-file-header">
                <div class="flex items-center">
                    <button on:click={() => removeFileHandle(i)} class="preview-file-remove" type="button" data-align="left">
                        <svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><path d="M11.586 13l-2.293 2.293a1 1 0 0 0 1.414 1.414L13 14.414l2.293 2.293a1 1 0 0 0 1.414-1.414L14.414 13l2.293-2.293a1 1 0 0 0-1.414-1.414L13 11.586l-2.293-2.293a1 1 0 0 0-1.414 1.414L11.586 13z" fill="currentColor" fill-rule="nonzero"></path></svg>
                    </button>
                </div>

            </header>
            <img class="preview-file-img" src={file?.src} alt="">
        </article>
        {/each}

        <input type="hidden" name={multiple ? "multiple_removeFileIds_" + name : "removeFileIds_" + name} bind:value={removeFilesIds}>
        <input type="hidden" name={multiple ? "multiple_selectedMediaIds_" + name : "selectedMediaIds_" + name} bind:value={selectedDocsIds}>
    </div>
</div> 

<style>
    /* Preview files */
  .preview-files {
      padding: 8px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      cursor: default;
  }

  .preview-file {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    padding: 8px;
    background-color: #4b4b4b2e;
  }

  .preview-file-header {
    position: absolute;
    top: 0;
    left: 0;
    padding: 10px;
    width: 100%;
    
  }

  .preview-file-remove {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border-radius: 100%;
    background-color: rgba(31,37,49,.85);
  }

  .preview-file-img {
      border-radius: 8px;
  }
</style>