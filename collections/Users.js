export const Users = {
    name: "Users",
    useAsTitle: "email",
    fields: [
      {
        name: "username",
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
        type: "password",
        required: true,
      },
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