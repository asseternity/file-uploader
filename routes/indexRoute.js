const express = require('express');
const indexRoute = express.Router();
const indexController = require('../controllers/indexController');

indexRoute.get('/', indexController.getIndex);
indexRoute.post('/', indexController.postIndex);

module.exports = indexRoute;