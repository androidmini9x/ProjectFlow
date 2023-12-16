import dbClient from "../utils/db";

class AuthController {
    static async is_auth(req, res, next) {

        const sessionID = req.header('X-Token');
        if (!sessionID) return res.status(401).send({ error: 'Unauthorized' });

        const session = await dbClient.get('sessions', { token: sessionID });

        if (!session) return res.status(401).send({ error: 'Unauthorized' });

        res.user_session = session;

        next();
    }
}

export default AuthController;
