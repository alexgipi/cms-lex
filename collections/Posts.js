export const Posts = {
    name: 'Posts',
    useAsTitle: 'editor',
    labels: {
      singular: {
        en: 'Post',
        es: 'Post',
      },
      plural: {
        en: 'Posts',
        es: 'Posts',
      },
    },
    fields: [
      // Email added by default
      {
        name: "menu_items",
        type: "array",
        default: null,
        label: {
          es: "Elementos del menú",
          en: "Menu items",
        },
        labels: {
          singular: {
            es: "Elemento de menú",
            en: "Menu item",
          },
          plural: {
            es: "Elementos de menú",
            en: "Menu items",
          },
        },
        fields: [
          {
            name: "label",
            type: "text",
            required: true,
            label: {
              es: "Label",
              en: "Label",
            },
          },
          {
            name: "link",
            type: "text",
            required: true,
            label: {
              es: "Enlace",
              en: "Link",
            },
          },
        ],
        options: {
          sidebar: false,
        },
      },
      {
          name: 'editor',
          type: 'text',
          required: true,
          label: {
            en: 'Editor',
            es: 'Editor',
          }
      },
      {
          name: 'pageMeta', // required
          type: 'group', // required
          fields: [
            // required
            {
              name: 'title',
              type: 'text',
              minLength: 20,
              maxLength: 100,
            },
            {
              name: 'description',
              type: 'textarea',
              minLength: 40,
              maxLength: 160,
            },
          ],
      },
      {
        type: 'row', // required
        fields: [
          // required
          {
            name: 'label',
            type: 'text',
            required: true,
            admin: {
              width: '50%',
            },
          },
          {
            name: 'value',
            type: 'text',
            required: true,
            admin: {
              width: '50%',
            },
          },
        ],
      },
    ],
  }