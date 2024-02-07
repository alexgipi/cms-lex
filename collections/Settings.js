export const Settings = {
    name: "Lexi Settings",
    slug: "lexi-settings",
    labels: {
      singular: {
        en: "Product",
        es: "Producto",
      },
      plural: {
        en: "Lexi Settings",
        es: "Ajustes de Lexi",
      },
    },
    fields: [
      {
        name: "sitename",
        type: "text",
        default: null,
        label: {
          es: "Nombre del sitio",
          en: "Site name",
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
      {
        name: "sitelogo",
        type: "image",
        relationTo: "Media",
        label: {
          es: "Imagen del sitio",
          en: "Site logo",
        },
        default: null,
        options: {
          sidebar: true,
        },
      },
      {
        name: "language",
        type: "select",
        default: "ES",
        enum: ["ES", "EN"],
        label: {
          es: "Idioma",
          en: "Language",
        },
        options: {
            sidebar: true,
        }
      },
    ],
}