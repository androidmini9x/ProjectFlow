import UsersController from '../controllers/UsersController';

const { Router } = require('express');

const routes = Router();

routes.post('/register', UsersController.register);
routes.post('/login', UsersController.login);

module.exports = routes;