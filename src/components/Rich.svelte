<script>
  import Editor from "@tinymce/tinymce-svelte";
  export let name = 'content';
  export let value = '';
  let apiKey = "z1slmiozbyb9ua0vcd0vm5ekcvyi265xfxhau59uug2otdcy";
  let conf = {
    height: 500,
    plugins: [
      // "a11ychecker",
      "advlist",
      // "advcode",
      // "advtable",
      "autolink",
      // "checklist",
      // "export",
      "lists",
      "image",
      "link",
      "charmap",
      "preview",
      "anchor",
      "searchreplace",
      "visualblocks",
      // "powerpaste",
      "fullscreen",
      // "formatpainter",
      "insertdatetime",
      "code",
      "media",
      "table",
      "help",
      "wordcount",
      "accordion"
    ],
    toolbar:
      "undo redo | a11ycheck casechange blocks | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | " +
      "bullist numlist checklist outdent indent | removeformat | link image | table accordion code help",
    menubar: false,
    skin: 'oxide'
  };
  function change(event) {
    console.log(event)
  }
</script>

<div class="rich-editor">
  <!-- <Editor
    {apiKey}
    {conf}
    value=""
    name='editor'
    on:change={change}
  /> -->
  <Editor
  {apiKey}
  {conf}
  bind:value={value}
  />
  <textarea class="hidden" name={name} bind:value={value}></textarea>
</div>

<style>
  .rich-editor {
    width: 100%;
    min-height: 300px;
  }
  
</style>