import ProjectController from '../controllers/ProjectController';
import AuthController from '../controllers/AuthController';

const { Router } = require('express');

const routes = Router();

// Auth middle ware
routes.use('/project/', AuthController.is_auth);

routes.post('/project/create', ProjectController.create);
routes.get('/project/:id', ProjectController.get);
routes.delete('/project/:id', ProjectController.delete);
routes.put('/project/:id', ProjectController.edit);
routes.get('/project', ProjectController.get_all);

module.exports = routes;