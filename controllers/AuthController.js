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

    static async getMe(req, res) {

        const { user_id } = res.user_session;

        const user = await dbClient.get('users', {
            _id: user_id
        });

        if (!user) return res.status(401).send({ error: 'Unauthorized' });

        delete user.password;

        return res.status(200).send({ ...user });
    }
}

export default AuthController;
