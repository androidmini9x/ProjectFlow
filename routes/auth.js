import AuthController from '../controllers/AuthController';

const { Router } = require('express');

const routes = Router();

// Auth middle ware
routes.use('/info', AuthController.is_auth);

routes.get('/info', AuthController.getMe);

module.exports = routes;