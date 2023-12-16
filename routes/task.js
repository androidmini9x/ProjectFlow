import TaskController from '../controllers/TaskController';

const { Router } = require('express');

const routes = Router();


routes.get('/project/:project_id/task', TaskController.get_all);
routes.post('/project/:project_id/task', TaskController.create);
routes.get('/project/:project_id/task/:task_id', TaskController.get);
routes.put('/project/:project_id/task/:task_id', TaskController.edit);
routes.delete('/project/:project_id/task/:task_id', TaskController.delete);

module.exports = routes;