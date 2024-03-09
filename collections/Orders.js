export const Orders = {
  name: "Orders",
  useAsTitle: "orderNumber",
  access: {
    read: ({ req: { user } }) => {
      if (user) {
        if (user?.role === "super_admin") {
          return true;
        }

        return {
          user: user.id,
        };
      } else {
        return false;
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
      enum: [
        "pending",
        "processing",
        "on-hold",
        "completed",
        "cancelled",
        "refunded",
        "failed",
        "checkout-draft",
      ],
      default: "processing",
      label: {
        es: "Estado",
        en: "Status",
      },
      options: {
        sidebar: true,
      },
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
        sidebar: true,
      },
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
        sidebar: true,
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
        sidebar: true,
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
        sidebar: true,
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
        sidebar: true,
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
        sidebar: true,
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
        sidebar: true,
      },
    },
    {
      name: "guestCustomerId",
      type: "text",
      default: null,
      options: {
        sidebar: true,
      },
      label: {
        es: "Id. Usuario invitado",
        en: "Guest Customer ID",
      },
    },
  ],
};
