export const Pages = {
  name: "Pages",
  access: {
    read: () => true,
  },
  labels: {
    singular: {
      es: "Página",
      en: "Page",
    },
    plural: {
      es: "Páginas",
      en: "Pages",
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
      unique: true,
      required: true,
      options: {
        sidebar: true,
      },
    },
    {
      name: "content",
      type: "richText",
      default: null,
      label: {
        es: "Contenido",
        en: "Content",
      },
    },
  ],
};
