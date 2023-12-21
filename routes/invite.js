import AuthController from '../controllers/AuthController';
import InviteController from '../controllers/InviteController';

import { Router } from 'express';

const routes = Router();

routes.use('/invitations', AuthController.is_auth);

routes.post('/project/:project_id/invite', InviteController.invite);
routes.get('/project/invitation/:invite_id', InviteController.join);
routes.delete('/project/invitation/:invite_id', InviteController.revoke);
routes.get('/project/:project_id/invitation', InviteController.get_all);
routes.get('/invitations', InviteController.get_mine);

module.exports = routes;