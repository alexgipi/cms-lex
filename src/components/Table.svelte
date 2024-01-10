<script lang="ts">
    export let collection:string | undefined;
    export let documents:any = [];
    let documentsToRender:any[] = documents;

    const title = "Lexgi CMS";

    const urlParams = new URLSearchParams(window.location.search);

    const limitParam = urlParams.get('limit');
    const sortParam = urlParams.get('sort');
    const pageParam = urlParams.get('page');
    console.log({
      limitParam,
      sortParam,
      pageParam
    })

    let keysClean: string[] = [];

    if(collection === 'settings'){

    }else {
        if (documents.length > 0) {
            // Obtiene las claves del primer documento (suponiendo que todos los documentos tienen las mismas claves)
            const allKeys = Object.keys(documents[0]);
            const keysToIgnore = ['__v'];
            keysClean = allKeys.filter(key => !keysToIgnore.includes(key));

            console.log(keysClean)
        } else {
            
        }
    }

    let selectedItems:any = [];
    let allSelected:boolean = false;
    function selectAllHandle(event:any){
      allSelected = event.target.checked;

      if(allSelected){
        selectedItems = documents;
      }else {
        selectedItems = [];
      }
      console.log(selectedItems);
    }

    function selectItem(event: any, document: any, docIndex: number) {
      const { checked } = event.target;

      if (checked) {
        // Si el checkbox está marcado, crea una nueva copia de selectedItems con el elemento agregado
        selectedItems = [...selectedItems, document];
      } else {
        // Si el checkbox está desmarcado, crea una nueva copia de selectedItems sin el elemento
        selectedItems = selectedItems.filter((item: any) => item._id !== document._id);
      }

      console.log(selectedItems);
    }

    let searchInputElement:any;
    function searchFilter(event:any){
      const searchValue = searchInputElement.value;
      
      console.log({searchValue})

      const filteredDocs = documents.filter((document:any) => {
        return document.name.toLowerCase().includes(searchValue.toLowerCase())
      });

      documentsToRender = filteredDocs;
      
    }

    let perPageOptionsOpened:boolean = false;
    function togglePerPageOptions(){
      perPageOptionsOpened = !perPageOptionsOpened;
    }
</script>

<div class="table">
  <header class="table-header">
    <div class="table-search">
      <input on:keyup={searchFilter} bind:this={searchInputElement} type="text" placeholder="Search">
    </div>
    <div class="table-controls">
      {#if selectedItems.length > 0}
        <button class="red">Delete {selectedItems.length}</button>
      {/if}

      <button>
        Columns
        <svg class="icon chevron-icon" viewBox="0 0 9 7" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><path class="stroke" d="M1.42871 1.5332L4.42707 4.96177L7.42543 1.5332"></path></svg>
      </button>
      <button>
        Filters
        <svg class="icon chevron-icon" viewBox="0 0 9 7" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><path class="stroke" d="M1.42871 1.5332L4.42707 4.96177L7.42543 1.5332"></path></svg>
      </button>
    </div>
  </header>

  <table cellpadding="0" cellspacing="0">
    <thead>
      <tr>
        <th id="heading-_select">
          <div class="checkbox-input select-all__checkbox">
            <div class="checkbox-input__input">
              <input on:change={selectAllHandle} aria-label="Select all rows" id="select-all" type="checkbox"/>
            </div>
          </div>
        </th>

        {#each keysClean as key, i}
          <th id={"heading-" + key}>
              <div class="sort-column">
                <span class="sort-column__label capitalize">{key || '--'}</span>
                <div class="sort-column__buttons">
                    <button aria-label="Sort by Name Ascending" class="sort-column__asc sort-column__button">
                    <svg class="icon icon--chevron" viewBox="0 0 9 7" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" style="transform: rotate(180deg);"><path class="stroke" d="M1.42871 1.5332L4.42707 4.96177L7.42543 1.5332"></path></svg>
                    </button>
                    <button aria-label="Sort by Name Descending" class="sort-column__desc sort-column__button"><svg class="icon icon--chevron" viewBox="0 0 9 7" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><path class="stroke" d="M1.42871 1.5332L4.42707 4.96177L7.42543 1.5332"></path></svg>
                    </button>
                </div>
              </div>
          </th>
        {/each}
        
      </tr>
    </thead>

    <tbody>
      {#each documentsToRender as document, i}
          <tr class="row-1">
              <td class="cell-_select">
              <div class="checkbox-input select-row__checkbox">
                  <div class="checkbox-input__input">
                  <input checked={allSelected} on:change={(e) => selectItem(e, document, i)} type="checkbox"/>
                  <span class="checkbox-input__icon check">
                      <svg class="icon icon--check" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg"><path class="stroke" d="M10.6092 16.0192L17.6477 8.98076" stroke-linecap="square" stroke-linejoin="bevel"></path><path class="stroke" d="M7.35229 12.7623L10.6092 16.0192" stroke-linecap="square" stroke-linejoin="bevel"></path></svg>
                  </span>
                  </div>
              </div>
              </td>

              {#each keysClean as key, index}
                  <td class={"cell-" + key}>
                      {#if key === '_id'}
                          <div>
                              {#if index === 0}
                                  <a href="#" class="code-cell">
                                      <span>ID: {document[key]}</span>
                                  </a>
                              {:else}
                                  <code class="code-cell" style="">
                                      <span>ID: {document[key]}</span>
                                  </code>
                              {/if}
                          </div>
                      {:else}
                          <div>
                              {#if index === 0}
                                  <a href="#">
                                      {document[key]}
                                  </a>
                              {:else}
                                  <span>
                                      {document[key]}

                                      {#if !document[key]}
                                          <span>&lt;No {key}&gt;</span>
                                      {/if}
                                  </span>
                              {/if}
                          </div>
                      {/if}
                  </td>
              {/each}
          </tr>
      {/each}
    </tbody>

    
  </table>

  <footer class="table-footer">
    <div class="table-pagination">
      <button class="pagination-btn prev">
        <svg class="pagination-icon prev" width="14" height="14" xmlns="http://www.w3.org/2000/svg" fill="none" role="img" aria-label="chevron left outline" viewBox="0 0 6 11"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m5 1.549-4 3.79 4 3.792"></path></svg>
      </button>
      
      <button class="pagination-btn">
        1
      </button>
      <button class="pagination-btn">
        2
      </button>
      <button class="pagination-btn">
        3
      </button>

      <button class="pagination-btn">
        <svg class="pagination-icon next" xmlns="http://www.w3.org/2000/svg" fill="none" role="img" aria-label="chevron right outline" viewBox="0 0 6 11"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9.13 4-3.79-4-3.791"></path></svg>
      </button>
    </div>
    <div class="pagination-controls">
      <span class="pagination-info">
        1 - 4 of 4
      </span>
      <button on:click={togglePerPageOptions} class="items-per-page">
        <strong>Per page: 5 </strong>
        <svg class="icon chevron-icon s-FSXjL0jQBA96" viewBox="0 0 9 7" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><path class="stroke s-FSXjL0jQBA96" d="M1.42871 1.5332L4.42707 4.96177L7.42543 1.5332"></path></svg>
      </button>

      <div class="items-per-page-options {perPageOptionsOpened ? 'opened' : ''}">
        <button>5</button>
        <button>10</button>
        <button>25</button>
        <button>50</button>
      </div>
    </div>
  </footer>
</div>

<style>

  .capitalize {
    text-transform: capitalize;
  }

  .table-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    background: #0c0c0c;
    border-radius: 6px;
  }

  .table-search {
    display: flex;
    border-radius: 5px;
    flex: auto;

    & input {
      padding: 10px 22px;
      background: unset;
      border: none;
      width: 100%;
      outline: none;
      color: #fff;
    }
  }

  .table-controls {
    display: flex;
    gap: 10px;
    padding: 14px;

    & button {
      border: none;
      border-radius: 6px;
      color: rgb(189 189 189);
      background-color: rgb(51, 51, 51);
      padding: 8px 14px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 12px;

      & .chevron-icon {
        width: 14px;
        fill: none;
        stroke: #8d8d8d;
      }

      &.red {
        background: #ff3343;
        color: #2e0004;
      }
    }
  }

  table {
    width: 100%;
    background: black;
    border-radius: 10px;
    outline: 1px solid #101010;
  }

  th {
    padding: 24px 20px;
  }

  .checkbox-input {
      display: flex;
      justify-content: center;
  }

  .checkbox-input__input {
    display: flex;

    & input {
      accent-color: #924beb;
      width: 18px;
      height: 18px;
    }
  }

  tbody {
    & tr:nth-child(odd) {
      background: #090909;
    }
  }

  .sort-column {
      display: flex;
      align-items: center;
      gap: 15px;
  }

  .sort-column__buttons {
    display: flex;
  }

  .sort-column__button {
    width: 32px;
    border: none;
    display: flex;
    align-items: center;
    background: transparent;
    color: #fff;
  }

  .sort-column__button svg {
      stroke: #898989;
      fill: transparent;
  }

  td {
    padding: 16px 20px;
    border-top: 1px solid #161616;
    font-size: 0.8em;
    color: #7c7c7c;

    & a:not(.code-cell) {
      color: #828282;
    }
  }

  .code-cell {
    font-family: Menlo,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New,monospace;
    font-size: 12px;
    padding: 4px;
    background: #23232385;
    padding: 10px 15px;
    border-radius: 6px;
    display: inline-flex;
    align-items: center;
    line-height: 1;
    color: #d2d2d2;

    &:hover {
      color: #fff;
    }
  }

  .table-footer {
    display: flex;
    margin-top: 20px;
    justify-content: space-between;
  }

  .table-pagination {
    display: flex;
    background: #090909;
    border-radius: 8px;
    border: 1px solid #2727277a;
  }

  .pagination-btn {
    width: 40px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    color: #9d9d9d;
    background: transparent;
    cursor: pointer;
    border-right: 1px solid #2727277a;

    &:last-child {
      border: none;
    }
  }

  .pagination-icon {
    width: 14px;
    height: 14px;
  }


  .pagination-controls {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.84em;
    position: relative;
  }

  .pagination-info {
    opacity: 0.5;
    font-size: 0.84em;
  }

  .items-per-page {
    position: relative;
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    color: #fff;
    background: no-repeat;
    border: none;
    padding: 5px 0;

    & strong {
      font-weight: 600;
    }

    & .chevron-icon {
      width: 14px;
      height: 14px;
      fill: none;
      stroke: currentColor;
    }
  }

  .items-per-page-options {
    position: absolute;
    display: flex;
    flex-direction: column;
    right: 0;
    bottom: 38px;
    min-width: 114px;
    background: #2222228c;
    border-radius: 5px;
    align-items: flex-start;
    padding: 10px 0;
    backdrop-filter: blur(7px);
    cursor: default;
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.3s ease, visibility 0.3s ease;

    & button {
      width: 100%;
      text-align: left;
      padding: 11px 14px;
      border: none;
      background: no-repeat;
      color: #afafaf;
      cursor: pointer;
    }

    &.opened {
      visibility: visible;
      opacity: 1;
    }
  }

  .no-content-section {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2rem;
    margin: 3rem 0;

    & p {
      font-size: 0.84em;
      color: #a7a7a7;
      margin: 0;
    }

    & button {
      padding: 16px 27px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
    }
  }
</style>