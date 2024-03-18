export const Products = {
    name: "Products",
    useAsTitle: "name",
    access: {
      read: () => true,
    },
    labels: {
      singular: {
        es: "Producto",
        en: "Product",
      },
      plural: {
        es: "Productos",
        en: "Products",
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
        unique: true,
        options: {
          sidebar: true,
        },
      },
      {
        name: "type",
        type: "select",
        default: "simple",
        enum: ["simple", "variable", "downloadable"],
        label: {
          es: "Tipo de producto",
          en: "Product Type",
        },
      },
      {
        name: "price",
        type: "number",
        default: null,
        label: {
          es: "Precio",
          en: "Price",
        },
      },
      {
        name: "categories",
        type: "relation",
        relationTo: "Product categories",
        hasMany: true,
        default: null,
        options: {
          sidebar: true,
        },
        label: {
          es: "Categorías",
          en: "Categories",
        },
      },
      {
        name: "short_description",
        type: "richText",
        default: null,
        label: {
          es: "Descripción corta",
          en: "Short description",
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
      // {
      //   name: "image",
      //   type: "image",
      //   relationTo: "Media",
      //   label: {
      //     es: "Imagen de producto",
      //     en: "Product Image",
      //   },
      //   default: null,
      //   options: {
      //     sidebar: true,
      //   },
      // },
      {
        name: "images",
        type: "images",
        default: null,
        multiple: true,
        relationTo: "Media",
        hasMany: true,
        max: 10,
        options: {
          sidebar: true,
        },
        label: {
          es: "Galería de producto",
          en: "Product Gallery",
        },
      },
      {
        name: "attributes",
        type: "relation",
        relationTo: "Product attributes",
        hasMany: true,
        default: null,
        label: {
          es: "Atributos",
          en: "Attributes",
        },
      },
      {
        name: "stock",
        type: "number",
        default: null,
        options: {
          sidebar: true,
        },
      },
      {
        name: "out_of_stock",
        type: "boolean",
        default: false,
        options: {
          sidebar: true,
        },
        label: {
          es: "Fuera de 'Stock'",
          en: "Out of Stock",
        },
      },
      {
        name: "weight",
        type: "number",
        default: null,
        options: {
          sidebar: true,
        },
        placeholder: {
          es: "Peso en kg (Formato decimal)",
          en: "Ex: 0.5 (500 grams)"
        },
        label: {
          es: "Peso (kg)",
          en: "Weight",
        },
      },
    ],
}