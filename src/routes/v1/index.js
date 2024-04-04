const express = require('express');
const router = express.Router();

const fs = require('fs');
const path = require('path');
  
const baseDir = path.join(__dirname, '.');

fs.readdir(baseDir, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    const routeFiles = files.filter((file) => file.endsWith('.route.js'));
  
    routeFiles.forEach((file) => {
        const routeName = file.replace('.route.js', '');
        const controllerPath = path.join(baseDir, file);
        const controller = require(controllerPath);
        router.use(`/${routeName}`, controller);
    });
});
module.exports = router;