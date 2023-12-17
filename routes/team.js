import { Router } from "express";
import TeamController from "../controllers/TeamController";

const routes = Router();

routes.get('/project/:project_id/teams', TeamController.get);
routes.delete('/project/:project_id/teams', TeamController.remove);
routes.post('/project/:project_id/teams', TeamController.leave);

module.exports = routes;