export const Users = {
    name: "Users",
    useAsTitle: "email",
    auth: true,
    access: {
      read: () => true,
    },
    labels: {
      singular: {
        es: "Usuario",
        en: "User",
      },
      plural: {
        es: "Usuarios",
        en: "Users",
      },
    },
    fields: [
      {
        name: "role",
        type: "select",
        enum: ["super_admin", "admin", "customer"],
        default: "customer",
        options: {
          sidebar: true
        }
      },
      {
        name: "name",
        type: "text",
        default: null,
      },
      {
        name: "address",
        type: "text",
        default: null,
      },
    ],
}