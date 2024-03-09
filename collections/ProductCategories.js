
export const ProductCategories = {
  name: "Product categories",
  useAsTitle: "name",
  useAsSubtitle: "slug",
  access: {
    read: ({req: {user}}) => {
      return true
    },
  },
  labels: {
    singular: {
      es: "Categoría de producto",
      en: "Product category",
    },
    plural: {
      es: "Categorías de producto",
      en: "Product categories",
    },
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      unique: true,
      label: {
        es: "Nombre",
        en: "Name",
      },
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      options: {
        sidebar: true,
      },
    },
    {
      name: "images",
      type: "images",
      multiple: true,
      relationTo: "Media",
      hasMany: true,
      max: 10,
      default: null,
      options: {
        sidebar: true,
      },
      label: {
        es: "Imágenes",
        en: "Images",
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
      name: "totalProducts",
      type: "number",
      default: 0,
    },
  ],    
}