import swaggerJsdoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                },
            },
        },
        info: {
        title: "Weather App Task",
        version: "1.0.0",
        description: "API documentation the application",
        },
    },
    apis: ["./routes/*.js"],
};
const swaggerSpecs = swaggerJsdoc(options);

export default swaggerSpecs;
