export const Media = {
  name: "Media",
  upload: {
    staticURL: "/uploads",
    staticDir: "uploads",
    imageSizes: [
      {
        name: "thumbnail",
        width: 400,
        height: 300,
        position: "centre",
      },
      {
        name: "card",
        width: 768,
        height: 1024,
        position: "centre",
      },
      {
        name: "tablet",
        width: 1024,
        // By specifying `undefined` or leaving a height undefined,
        // the image will be sized to a certain width,
        // but it will retain its original aspect ratio
        // and calculate a height automatically.
        height: undefined,
        position: "centre",
      },
    ],
    adminThumbnail: "thumbnail",
    mimeTypes: ["image/*"],
  },
  labels: {
    singular: {
      es: "Medios",
      en: "Media",
    },
    plural: {
      es: "Medios",
      en: "Media",
    },
  },
  fields: [
    {
      name: "file",
      type: "image",
      required: true,
      label: {
        es: "Archivo",
        en: "File",
      },
    },
    {
      name: "slug",
      type: "text",
      default: null,
      options: {
        sidebar: true,
      },
    },
    {
      name: "alt",
      type: "text",
      default: null,
      options: {
        sidebar: true,
      },
      label: {
        es: "Texto alternativo",
        en: "Alt text",
      },
    },
    {
      name: "legend",
      type: "text",
      default: null,
      options: {
        sidebar: true,
      },
      label: {
        es: "Leyenda",
        en: "Legend",
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
