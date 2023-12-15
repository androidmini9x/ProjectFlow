import { v4 as uuidv4 } from 'uuid';
import dbClient from "../utils/db";

const bcrypt = require('bcrypt');

class UsersController {
    static async register(req, res) {
        let {
            firstname,
            lastname,
            email,
            password,
        } = req.body;

        if (!firstname) return res.status(400).send({ error: 'Missing first name' });
        if (!lastname) return res.status(400).send({ error: 'Missing last name' });
        if (!email) return res.status(400).send({ error: 'Missing email' });
        if (!password) return res.status(400).send({ error: 'Missing password' });

        email = email.trim().toLowerCase();

        const isExist = await dbClient.get('users', { email });
        if (isExist) return res.status(400).send({ error: 'This email is already exist' });

        // Encrypt password
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await dbClient.insert('users', { firstname, lastname, email, password: hashedPassword });

        if (!user.acknowledged) return res.status(404).send({ error: 'Failed to create a new user' });

        return res.status(201).send({ message: 'Registration successful' });
    }

    static async login(req, res) {
        let { email, password } = req.body;

        if (!email || !password) return res.status(404).send({ error: 'You should use email & password to sign in' });

        email = email.trim().toLowerCase();


        const isExist = await dbClient.get('users', { email });
        if (!isExist) return res.status(401).send({ error: 'User with given info not found' });
        const hashedPassword = await bcrypt.compare(password, isExist.password);
        if (!hashedPassword) return res.status(401).send({ error: 'User with given info not found' });

        const sessionID = uuidv4();

        return res.status(200).send({ token: sessionID });
    }
}

export default UsersController;
