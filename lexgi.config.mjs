import { Users } from "./collections/Users.js";
import  { Products }  from "./collections/Products.js"

export const CollectionsConfig = [
  Users,
  Products,
  {
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
  },
  {
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
  },
  {
    name: "Orders",
    useAsTitle: "orderNumber",
    access: {
      read: ({req: {user}}) => {
        if(user){
          if (user?.role === 'super_admin') {
            return true;
          }
          
          return {
            user: user.id
          }
        }else {
          return false
        }
      },
      create: () => true,
    },
    labels: {
      singular: {
        es: "Pedido",
        en: "Order",
      },
      plural: {
        es: "Pedidos",
        en: "Orders",
      },
    },
    fields: [
      {
        name: "createdAt",
        type: "date",
        label: {
          es: "Fecha del pedido",
          en: "Order date",
        },
      },
      {
        name: "status",
        type: "select",
        enum: ["pending", "processing", "on-hold", "completed", "cancelled", "refunded", "failed", "checkout-draft"],
        default: "processing",
        label: {
          es: "Estado",
          en: "Status",
        },
        options: {
          sidebar: true
        }
      },
      {
        name: "orderNumber",
        type: "text",
        unique: true,
        required: true,
        label: {
          es: "Número del pedido",
          en: "Order number",
        },
        options: {
          sidebar: true
        }
      },
      {
        name: "customerName",
        type: "text",
        required: true,
        label: {
          es: "Nombre del cliente",
          en: "Customer name",
        },
      },
      {
        name: "items",
        type: "object",
        required: true,
        label: {
          es: "Artículos del pedido",
          en: "Order items",
        },
      },
      {
        name: "email",
        type: "text",
        required: true,
        label: {
          es: "Correo electrónico",
          en: "Email",
        },
      },
      {
        name: "shippingAddress",
        type: "object",
        required: true,
        label: {
          es: "Dirección de envío",
          en: "Shipping Address",
        },
      },
      {
        name: "billingAddress",
        type: "object",
        required: true,
        label: {
          es: "Dirección de facturación",
          en: "Billing Address",
        },
      },
      {
        name: "total",
        type: "number",
        required: true,
        label: {
          es: "Total",
          en: "Total",
        },
        options: {
          sidebar: true
        },
      },
      {
        name: "subtotal",
        type: "number",
        required: true,
        label: {
          es: "Subtotal",
          en: "Subtotal",
        },
        options: {
          sidebar: true
        },
      },
      {
        name: "shippingCost",
        type: "number",
        required: true,
        label: {
          es: "Coste de envío",
          en: "Shipping Cost",
        },
        options: {
          sidebar: true
        },
      },
      {
        name: "shippingType",
        type: "text",
        required: true,
        label: {
          es: "Tipo de envío",
          en: "Shipping Type",
        },
        options: {
          sidebar: true
        },
      },
      {
        name: "paymentMethod",
        type: "text",
        required: true,
        label: {
          es: "Metodo de pago",
          en: "Payment method",
        },
        options: {
          sidebar: true
        },
      },
      {
        name: "user",
        type: "relation",
        relationTo: "Users",
        default: null,
        label: {
          es: "Usuario",
          en: "User",
        },
        options: {
          sidebar: true
        }
      },
      {
        name: "guestCustomerId",
        type: "text",
        default: null,
        options: {
          sidebar: true
        },
        label: {
          es: "Id. Usuario invitado",
          en: "Guest Customer ID",
        },
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
          sidebar: true
        }
      },
      {
        name: "alt",
        type: "text",
        default: null,
        options: {
          sidebar: true
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
          sidebar: true
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
  },
  {
    name: "Menus",
    access: {
      read: () => true,
    },
    labels: {
      singular: {
        es: "Menu",
        en: "Menu",
      },
      plural: {
        es: "Menus",
        en: "Menus",
      },
    },
    fields: [
      {
        name: "name",
        type: "text",
        unique: true,
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
        default: null,
        options: {
          sidebar: true
        }
      },
      {
        name: "menu_items",
        type: "array",
        default: null,
        label: {
          es: "Elementos del menú",
          en: "Menu items",
        },
        labels: {
          singular: {
            es: "Elemento de menú",
            en: "Menu item",
          },
          plural: {
            es: "Elementos de menú",
            en: "Menu items",
          },
        },
        fields: [
          {
            name: "label",
            type: "text",
            required: true,
            label: {
              es: "Label",
              en: "Label",
            },
          },
          {
            name: "link",
            type: "text",
            required: true,
            label: {
              es: "Enlace",
              en: "Link",
            },
          },
        ],
        options: {
          sidebar: false
        }
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
  },
  {
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
        default: null,
        options: {
          sidebar: true
        }
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
  },
];

export const lexiConfig = {
  collections: CollectionsConfig,
  settings: [
    {
      name: "Stripe Settings",
      slug: "stripe-settings",
      access: {
        read: ({req: {user}}) => {
          const role = user?.role;
          return role === 'super_admin';
        },
      },
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
    },
    {
      name: "Email Settings",
      slug: "email-settings",
      access: {
        read: () => false,
      },
      labels: {
        en: "Email Settings",
        es: "Ajustes de emails",
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