<script>
  import { onMount } from "svelte";

  export let name = '';
  export let value = '';

  let editorValue = '';

  if(value) editorValue = value;
	
	export let toolbarOptions = [
		[{ header: 1 }, { header: 2 }, "blockquote", "link", "image", "video"],
		["bold", "italic", "underline", "strike"],
		[{ list: "ordered" }, { list: "ordered" }],
		[{ align: [] }],
		["clean"]
	];
	
  onMount(async () => {
		const { default: Quill } = await import("quill");
	
    let quill = new Quill('#editor-content-'+name, {
      modules: { toolbar: true },
      theme: 'snow'
    });
    

    quill.on('editor-change', function(eventName, ...args) {
      value = quill.root.innerHTML;
    });
  });
</script>

<div class="flex flex-col">
  <div  class="editor-content" id={"editor-content-"+name}>{@html editorValue}</div>
  <textarea class="hidden" name={name}>{value}</textarea>
</div>

<style>
  @import 'https://cdn.quilljs.com/1.3.6/quill.snow.css';

  :global(.ql-toolbar.ql-snow, .ql-container.ql-snow) {
    border: 1px solid #eeeeee14 !important;
  }
  :global(.ql-toolbar.ql-snow) {
    border-radius: 8px 8px 0 0;
    padding: 1rem;
  }
  :global(.ql-container.ql-snow) {
    border-radius: 0 0 8px 8px;
  }

  :global(.ql-editor) {
    padding: 1.5rem;
  }

  .editor-content {
    min-height: 290px;
    font-size: 16px;
    color: #ffffffab;
  }
</style>

