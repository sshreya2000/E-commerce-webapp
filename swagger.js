export const definition = {
  openapi: "3.0.0",
  info: {
    title: "E-COMMERCE API",
    description: "e-commerce website using api",
    version: "1.0.0",
  },
  servers: [
    {
      url: "http://localhost:4000",
    },
  ],
  components: {
    securitySchemes: {
      JWT: {
        in: "header",
        name: "Authorization",
        type: "apiKey",
      },
    },
  },
  consumes: "application/json",
  produces: "application/json",
  paths: {
    "/api/users/signin": {
      post: {
        tags: ["Users"],
        summary: "Login",
        description: "User login to get token",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: {
                    type: "string",
                  },
                  password: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "ok",
          },
          400: {
            description: "Incorrect Credentials",
          },
        },
      },
    },
    "/api/products": {
      get: {
        tags: ["Products"],
        summary: "Get Products",
        description: "User will get all products",
        security: [{ JWT: {} }],
        responses: {
          200: {
            description: "ok",
          },
          401: {
            description: "Unauthorized",
          },
        },
      },
    },
  },
};
