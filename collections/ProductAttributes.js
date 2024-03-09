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
