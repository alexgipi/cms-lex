<script>
  export let objectValue;

  const objectString = JSON.stringify(objectValue, null, 4);
  const jsonObject = JSON.parse(objectString);
  // // analizeString(objectString);

    function analyzeStringoLD() {
        let newString = `<div class="pre-row"><span class="token punctuation">{</span></div>\n`;
        const entries = Object.entries(jsonObject);
        entries.forEach(([key, value], index) => {
            newString += `<div class="pre-row">`;
            newString += `  <span class="token property">"${key}"</span>`;
            newString += `<span class="token operator">: </span>`;

            if (value === null) {
                newString += `<span class="token null keyword">null</span>`;
            } else if (typeof value === 'string') {
                newString += `<span class="token string">"${value}"</span>`;
            } else if (typeof value === 'number') {
                newString += `<span class="token number">${value}</span>`;
            } else if (typeof value === 'object') {
                newString += `<span class="token punctuation">{</span>${JSON.stringify(value)}<span class="token punctuation">}</span>`;
            } else {
                newString += `<span class="token string">${value}</span>`;
            }

            if (index < entries.length - 1) {
                newString += `<span class="token punctuation">,</span>\n`;
            }
            newString += `</div>`;
        });
        newString += `<div class="pre-row"><span class="token punctuation">}</span></div>`;
        return newString.trim();
    }
    
    function isURL(texto) {
    var urlRegex = /(https?:\/\/(?:www\.|(?!www))[^\s.]+\.[^\s]{2,}|localhost[\d]*[^\s]*)/gi;
    return texto.match(urlRegex);
    }

    function analizeString(object, level = 0) {
        let newString = '<span class="token punctuation">{</span>';
        let space = '    ';
        level++; // Incrementa el nivel para este objeto
        
        if (Object.keys(object).length === 0) {
            newString += `<span class="token punctuation">}</span>`;
            return newString;
        }
        
        newString += '\n'; // Agrega salto de línea después de abrir llave
        
        for (const [key, value] of Object.entries(object)) {
            newString += space.repeat(level);
            newString += `<span class="token property">"${key}"</span>`;
            newString += `<span class="token operator">: </span>`;
            
            if (value === null) {
                newString += `<span class="token null keyword">null</span>`;
            } else if (typeof value === 'string') {
                if (isURL(value)) {
                    newString += `<a href="${value}" class="token string" target="_blank">"${value}"</a>`;
                } else {
                    newString += `<span class="token string">"${value}"</span>`;
                }
            } else if (typeof value === 'object') {
                newString += analizeString(value, level); // Pasa el nivel actual recursivamente
            } else {
                newString += `<span class="token number">${value}</span>`;
            }
            
            newString += ',\n';
        }
        
        newString = newString.replace(/,\n$/, ''); // Elimina la coma y el salto de línea al final
        
        newString += '\n' + space.repeat(level - 1); // Agrega salto de línea y espacios para el cierre de objeto
        newString += `<span class="token punctuation">}</span>`;
        
        return newString;
    }

</script>

<pre class="json-pre">
{@html analizeString(jsonObject)}
</pre>

<style>
  pre {
    padding: 2rem;
    background: #111;
    border-radius: 12px;
    overflow-x: auto; /* Añade barras de desplazamiento horizontal si es necesario */
  }

  .pre-row {
    display: inline-flex;
  }

  .token.operator {
    margin-right: 8px;
  }

  :global(a.token.string) {
    text-decoration: underline;
  }

  /* .token.punctuation {
        color: #6c757d;
    }
    .token.property {
        color: #6c757d;
    }

    .token.operator {
        color: #6c757d;
    }

    .token.string {
        color: #e83e8c;
    }
    .token.number {
        color: #007bff;
    }
    .token.keyword {
        color: #d63384;
    } */
</style>
