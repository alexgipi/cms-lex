export const Posts = {
    name: 'Posts',
    useAsTitle: 'editor',
    access: {
      read: () => true,
    },
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
        useAsTitle: 'label',
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
          {
            name: "peliculas",
            type: "array",
            default: null,
            useAsTitle: 'name',
            label: {
              es: "Peliculas",
              en: "Movie",
            },
            labels: {
              singular: {
                es: "Pelicula",
                en: "Movie",
              },
              plural: {
                es: "Peliculas",
                en: "Movies",
              },
            },
            fields: [
              {
                name: "name",
                type: "text",
                required: true,
                label: {
                  es: "Nombre",
                  en: "Name",
                },
              },
              {
                name: "director",
                type: "text",
                required: true,
                label: {
                  es: "Director",
                  en: "Director",
                },
              },
              {
                name: "actores",
                type: "array",
                default: null,
                label: {
                  es: "Actores",
                  en: "Actores",
                },
                labels: {
                  singular: {
                    es: "Actor",
                    en: "Movie",
                  },
                  plural: {
                    es: "Actores",
                    en: "Movies",
                  },
                },
                fields: [
                  {
                    name: "name",
                    type: "text",
                    default: null,
                    label: {
                      es: "Nombre",
                      en: "Name",
                    },
                  },
                  {
                    name: "originalName",
                    type: "text",
                    default: null,
                    label: {
                      es: "Nombre original",
                      en: "Original name",
                    },
                  },
                  {
                    name: "hijos",
                    type: "array",
                    default: null,
                    label: {
                      es: "Hijos",
                      en: "Hijos",
                    },
                    labels: {
                      singular: {
                        es: "Hijo",
                        en: "Movie",
                      },
                      plural: {
                        es: "Hijos",
                        en: "Movies",
                      },
                    },
                    fields: [
                      {
                        name: "childname",
                        type: "text",
                        default: null,
                        label: {
                          es: "Nombre del hijo",
                          en: "Name",
                        },
                      },
                    ],
                    options: {
                      sidebar: false,
                    },
                  },
                ],
                options: {
                  sidebar: false,
                },
              },
            ],
            options: {
              sidebar: false,
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
              default: null
            },
            {
              name: 'description',
              type: 'textarea',
              minLength: 40,
              maxLength: 160,
              default: null
            },
            {
              name: "menu_items2",
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
                  name: "label2",
                  type: "text",
                  required: true,
                  label: {
                    es: "Label",
                    en: "Label",
                  },
                },
                {
                  name: "link2",
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
          ],
      },
      {
        type: 'row', // required
        name:'test-row',
        fields: [
          // required
          {
            name: 'test',
            type: 'text',
            required: true,
          },
          {
            name: 'value',
            type: 'text',
            required: true,
          },
        ],
      },
    ],
  }