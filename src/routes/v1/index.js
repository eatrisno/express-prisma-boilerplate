const fs = require('fs');
const path = require('path');
const express = require('express');

const logger = require('../../common/logger');

const router = express.Router();

const baseDir = path.join(__dirname, '.');

fs.readdir(baseDir, (err, files) => {
  if (err) {
    logger.error('Error reading directory:', err);
    return;
  }

  const routeFiles = files.filter(((file) => file !== 'index.js' && file.endsWith('.js')));

  logger.info('Loading routes');
  routeFiles.forEach((file) => {
    const routeName = file.replace('.js', '');
    const controllerPath = path.join(baseDir, file);
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const controller = require(controllerPath);
    logger.info(`--> ${routeName}`);
    router.use(`/${routeName}`, controller);
  });
});
module.exports = router;
