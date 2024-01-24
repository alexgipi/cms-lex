
export const CollectionsConfig = [
  {
    name: "Users",
    fields: [
      {
        name: "name",
        type: "text",
        default: null,
      },
      {
        name: "userName",
        type: "text",
        required: true,
      },
      {
        name: "email",
        type: "text",
        required: true,
      },
      {
        name: "password",
        type: "text",
        required: true,
      },
      {
        name: "role",
        type: "text",
        default: "customer",
      },
      {
        name: "address",
        type: "text",
        default: null,
      },
    ],
  },
  {
    name: "Products",
    labels: {
      singular: {
        en: "Product",
        es: "Producto",
      },
      plural: {
        en: "Products",
        es: "Productos",
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
      {
        name: "image",
        type: "image",
        label: {
          es: "Imagen de producto",
          en: "Product Image",
        },
        default: null,
        options: {
          sidebar: true,
        },
      },
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
    ],
  },
  {
    name: "Product categories",
    fields: [
      {
        name: "name",
        type: "text",
        required: true,
        unique: true,
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
      },
      {
        name: "description",
        type: "richText",
        default: null,
      },
      {
        name: "totalProducts",
        type: "number",
        default: 0,
      },
    ],
  },
  {
    name: "Product attributes",
    fields: [
      {
        name: "name",
        type: "text",
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
      },
    ],
  },
  {
    name: "Orders",
    fields: [
      {
        name: "user",
        type: "relation",
        relationTo: "Users",
        default: null,
      },
      {
        name: "guestCustomerId",
        type: "text",
        default: null,
      },
      {
        name: "orderNumber",
        type: "text",
        unique: true,
        required: true,
      },
      {
        name: "items",
        type: "object",
        required: true,
      },
      {
        name: "email",
        type: "text",
        required: true,
      },
      {
        name: "customerName",
        type: "text",
        required: true,
      },
      {
        name: "shippingAddress",
        type: "object",
        required: true,
      },
      {
        name: "billingAddress",
        type: "object",
        required: true,
      },
      {
        name: "paymentMethod",
        type: "text",
        required: true,
      },
      {
        name: "subtotal",
        type: "number",
        required: true,
      },
      {
        name: "total",
        type: "number",
        required: true,
      },
      {
        name: "shippingCost",
        type: "number",
        required: true,
      },
      {
        name: "shippingType",
        type: "text",
        required: true,
      },
      {
        name: "status",
        type: "text",
        default: "processing",
        options: {
          sidebar: true,
        }
      },
    ],
  },
  {
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
    fields: [
      {
        name: "file",
        type: "image",
        reqired: true,
      },
      {
        name: "slug",
        type: "text",
        default: null,
        options: {
          sidebar: true
        }
      },
      {
        name: "alt",
        type: "text",
        default: null,
        options: {
          sidebar: true
        }
      },
      {
        name: "legend",
        type: "text",
        default: null,
        options: {
          sidebar: true
        }
      },
      {
        name: "description",
        type: "richText",
        default: null,
      },
    ],
  },
  {
    name: "Menus",
    fields: [
      {
        name: "name",
        type: "text",
        unique: true,
        reqired: true,
      },
      {
        name: "slug",
        type: "text",
        unique: true,
        default: null,
        options: {
          sidebar: true
        }
      },
      {
        name: "alt",
        type: "text",
        default: null,
        options: {
          sidebar: true
        }
      },
      {
        name: "legend",
        type: "text",
        default: null,
        options: {
          sidebar: true
        }
      },
      {
        name: "description",
        type: "richText",
        default: null,
      },
    ],
  },
  {
    name: "Pages",
    fields: [
      {
        name: "name",
        type: "text",
        reqired: true,
      },
      {
        name: "slug",
        type: "text",
        unique: true,
        default: null,
        options: {
          sidebar: true
        }
      },
      {
        name: "content",
        type: "richText",
        default: null,
      },
    ],
  },
];