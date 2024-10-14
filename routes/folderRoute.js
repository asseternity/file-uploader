const express = require('express');
const folderRoute = express.Router();
const folderController = require('../controllers/folderController');

folderRoute.post('/create', folderController.postCreate);
folderRoute.get('/', folderController.getIndex);
folderRoute.get('/edit/:id', folderController.getEdit);
folderRoute.post('/edit/:id', folderController.postEdit);

module.exports = folderRoute;