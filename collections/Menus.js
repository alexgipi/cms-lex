export const Menus = {
  name: "Menus",
  access: {
    read: () => true,
  },
  labels: {
    singular: {
      es: "Menu",
      en: "Menu",
    },
    plural: {
      es: "Menus",
      en: "Menus",
    },
  },
  fields: [
    {
      name: "name",
      type: "text",
      unique: true,
      required: true,
      label: {
        es: "Nombre",
        en: "Name",
      },
    },
    {
      name: "slug",
      type: "text",
      unique: true,
      default: null,
      options: {
        sidebar: true,
      },
    },
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
      name: "description",
      type: "richText",
      default: null,
      label: {
        es: "Descripción",
        en: "Description",
      },
    },
  ],
};
