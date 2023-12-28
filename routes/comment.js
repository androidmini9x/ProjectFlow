import { Router } from "express";
import CommentController from "../controllers/CommentController";

const routes = Router();

routes.get('/project/:project_id/task/:task_id/info', CommentController.get);
routes.post('/project/:project_id/task/:task_id/info', CommentController.post);

module.exports = routes;