export const productAttributes = {
  name: "Product attributes",
  access: {
    read: () => true,
  },
  labels: {
    singular: {
      es: "Atributo de producto",
      en: "Product attribute",
    },
    plural: {
      es: "Atributos de producto",
      en: "Product attributes",
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
      name: "slug",
      type: "text",
      required: true,
      options: {
        sidebar: true,
      },
    },
    {
      name: "label",
      type: "text",
      required: true,
      placeholder: {
        es: "Ej: Selecciona un color",
        en: "Ex: Select a color",
      },
      label: {
        es: "Label",
        en: "Label",
      },
    },
    {
      name: "options",
      type: "text",
      required: true,
      label: {
        es: "Opciones",
        en: "Options",
      },
    },
  ],
};
