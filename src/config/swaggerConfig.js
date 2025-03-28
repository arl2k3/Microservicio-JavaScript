const swaggerJSdoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Usuarios y Autentificacion',
      version: '1.0.0',
      description: 'Documentacion de la API de Usuarios y Autentificacion',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desarrollo',
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJSdoc(options);

const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));
    console.log('Swagger is running on http://localhost:3000/api-docs');
}

module.exports = setupSwagger;

