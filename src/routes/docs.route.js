const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerDefinition = require('../common/docs/swaggerDef');

const router = express.Router();

const specs = swaggerJsdoc({
  swaggerDefinition,
  apis: ['routes/*.js'],
});

router.use('/', swaggerUi.serve);

router.get(
  '/',
  swaggerUi.setup(specs, {
    explorer: true,
  }),
);

module.exports = router;
