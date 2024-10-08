const express = require('express');
const folderRoute = express.Router();
const folderController = require('../controllers/folderController');

folderRoute.post('/create', folderController.postCreate);

folderRoute.get('/', folderController.getIndex);

folderRoute.put('/:folderID', folderController.putFolderID);

folderRoute.delete('/:folderID', folderController.deleteFolderID);

module.exports = folderRoute;