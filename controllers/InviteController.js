import { v4 as uuidv4 } from 'uuid';
import dbClient from "../utils/db";
import { ObjectId } from 'mongodb';

class TeamController {
    static async invite(req, res) {
        // Invite employee to the project
        const { user_id } = res.user_session;
        const { project_id } = req.params;
        const { email } = req.body;

        const project = await dbClient.get('projects', { _id: new ObjectId(project_id) });
        if (!project) return res.status(404).send({ error: 'Not found' });
        if (project.owner.toString() != user_id.toString()) return res.status(401).send({ error: 'Unauthorized' });

        const invited = await dbClient.get('users', { email });
        if (!invited) return res.status(404).send({ error: 'This email is not register in our platform' });

        const invitation = uuidv4().toString().replaceAll('-', '');

        const invitations = await dbClient.insert('invitations', {
            user_id: invited._id,
            owner: user_id,
            project_id: new ObjectId(project_id),
            status: 'active',
            token: invitation
        });

        return res.status(200).send({
            message: 'Invitation created successfully',
            _id: invitations.insertedId,
            user_id: invited._id,
            owner: user_id,
            status: 'active',
            token: invitation,
            email: invited.email,
            firstname: invited.firstname,
            lastname: invited.lastname,
            invitation
        });
    }

    static async join(req, res) {
        const { user_id } = res.user_session;
        const { invite_id } = req.params;

        const invitation = await dbClient.get('invitations', {
            user_id,
            token: invite_id
        });

        if (!invitation || invitation.status != 'active') return res.status(404).send({ error: 'This invitation is expired' });

        await dbClient.update('invitations',
            { _id: invitation._id },
            { $set: { status: 'expired' } }
        );

        await dbClient.update('projects',
            { _id: invitation.project_id },
            { $push: { teams: user_id } }
        )

        return res.status(200).send({ message: 'Invitation Accepted', project_id: invitation.project_id.toString() });
    }

    static async revoke(req, res) {
        const { user_id } = res.user_session;
        const { invite_id } = req.params;

        const invitation = await dbClient.get('invitations', {
            owner: user_id,
            token: invite_id
        });

        if (!invitation || invitation.owner.toString() != user_id.toString()) return res.status(401).send({ error: 'Unauthorized' });

        const revoke = await dbClient.delete('invitations', {
            _id: invitation._id
        });
        if (revoke.deletedCount != 1) return res.status(404).send({ error: 'Failed to revoke the project' });

        return res.status(200).send({ message: 'Invitation revoked successfully' });
    }

    static async get_all(req, res) {
        const { user_id } = res.user_session;
        const { project_id } = req.params;

        const project = await dbClient.get('projects', { _id: new ObjectId(project_id) });
        if (!project) return res.status(404).send({ error: 'Not found' });

        if (project.owner.toString() != user_id.toString()) return res.status(401).send({ error: 'Unauthorized' });

        // const invitations = await dbClient.db.collection('invitations').find({ project_id: new ObjectId(project_id) }).limit(20).toArray();

        const invitations = await dbClient.db.collection('invitations').aggregate([
            {
                $match: { project_id: new ObjectId(project_id), state: 'active' }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$user", 0] }, "$$ROOT"] } }
            },
            { $project: { user: 0, password: 0, project_id: 0 } }
        ]).toArray();

        if (!invitations) return res.status(404).send({ error: 'Failed to fetch invitations' });

        return res.status(200).send(invitations);
    }

    static async get_mine(req, res) {
        const { user_id } = res.user_session;

        const invitations = await dbClient.db.collection('invitations').aggregate([
            {
                $match: { user_id: user_id, status: 'active' }
            },
            {
                $lookup: {
                    from: "projects",
                    localField: "project_id",
                    foreignField: "_id",
                    as: "project"
                }
            },
            {
                $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$project", 0] }, "$$ROOT"] } }
            },
            { $project: { project: 0, teams: 0, description: 0 } }
        ]).toArray();

        if (!invitations) return res.status(404).send({ error: 'Failed to fetch invitations' });

        return res.status(200).send(invitations);
    }
}

export default TeamController;