export const API_URL = import.meta?.env?.PUBLIC_API_URL || `http://localhost:${process.env.PORT || 3500}/api/`;
export const UPLOADS_URL = import.meta?.env?.PUBLIC_UPLOADS_URL || `http://localhost:${process.env.PORT || 3500}/uploads/`;
export const siteUrl = 'http://localhost:4321';

export const DEFAULT_LEXI_SETTINGS = {
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
        required: true,
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
        name: "custom_css",
        type: "richText",
        default: null,
        label: {
          es: "CSS Personalizado",
          en: "Custom CSS",
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