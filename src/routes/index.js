/* eslint-disable import/no-dynamic-require, global-require */
const fs = require('fs');
const path = require('path');
const express = require('express');

const logger = require('../common/config/logger');

const router = express.Router();

const baseDir = path.join(__dirname, '.');

fs.readdir(baseDir, (err, files) => {
  if (err) {
    logger.error('Error reading directory:', err);
    return;
  }

  const routeFiles = files.filter((file) => file.endsWith('.route.js'));

  routeFiles.forEach((file) => {
    const routeName = file.replace('.route.js', '');
    const controllerPath = path.join(baseDir, file);
    const controller = require(controllerPath);
    logger.info(`route /${routeName}`);
    router.use(`/${routeName}`, controller);
  });
});
module.exports = router;
