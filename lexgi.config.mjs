import { Users } from "./collections/Users.js";
import  { Products }  from "./collections/Products.js"
import { Settings } from "./collections/Settings.js";

export const CollectionsConfig = [
  Users,
  Products,
  {
    name: "Product categories",
    useAsTitle: "name",
    useAsSubtitle: "slug",
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
        type: "select",
        enum: ["pending", "processing", "on-hold", "completed", "cancelled", "refunded", "failed", "checkout-draft"],
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

export const lexiConfig = {
  collections: CollectionsConfig,
  settings: [
    {
      name: "Stripe Settings",
      slug: "stripe-settings",
      labels: {
        en: "Stripe Settings",
        es: "Ajustes de Stripe",
      },
      fields: [
        {
          name: "client_token",
          type: "text",
          required: true,
          // default: null,
          label: {
            es: "Client token",
            en: "Client token",
          },
        },
        {
          name: "webhook_secret",
          type: "password",
          default: null,
          label: {
            es: "Webhook secret",
            en: "Webhook secret",
          },
        },
      ],
  }
  ],
  dashboard: {
    title: "El mundo del saquito",
    short_title: "El mundo",
  }
}