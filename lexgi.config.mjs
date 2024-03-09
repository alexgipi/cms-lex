import { Users } from "./collections/Users.js";
import  { Products }  from "./collections/Products.js"
import { ProductCategories } from "./collections/ProductCategories.js";
import { productAttributes } from "./collections/ProductAttributes.js";
import { Orders } from "./collections/Orders.js";
import { Media } from "./collections/Media.js";
import { Menus } from "./collections/Menus.js";
import { Pages } from "./collections/Pages.js";

export const CollectionsConfig = [
  Users,
  Products,
  ProductCategories,
  productAttributes,
  Orders,
  Media,
  Menus,
  Pages,
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