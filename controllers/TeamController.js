import { ObjectId } from "mongodb";
import dbClient from "../utils/db";

class TeamController {
    static async get(req, res) {
        const { user_id } = res.user_session;
        const { project_id } = req.params;

        const project = await dbClient.get('projects', { _id: new ObjectId(project_id) });
        if (!project) return res.status(404).send({ error: 'Not found' });

        const auth = project.teams.find(e => e.toString() == user_id.toString());
        if (!auth) return res.status(401).send({ error: 'Unauthorized' });

        const teams = await dbClient.db.collection('users').find({
            _id: { $in: project.teams }
        }).project({ password: 0 }).toArray();

        if (!teams) return res.status(404).send({ error: 'Failed to fetch teams' });

        return res.status(200).send(teams);
    }
    static async remove(req, res) {
        const { user_id } = res.user_session;
        const { project_id } = req.params;
        const { removed_id } = req.body;

        const project = await dbClient.get('projects', { _id: new ObjectId(project_id) });
        if (!project) return res.status(404).send({ error: 'Not found' });

        if (project.owner.toString() != user_id.toString() || project.owner.toString() == removed_id) return res.status(401).send({ error: 'Unauthorized' });

        const idx = project.teams.findIndex(e => e.toString() == removed_id);
        if (idx == -1) return res.status(404).send({ error: 'User is not exists' });

        const updated = await dbClient.update('projects', {
            _id: new ObjectId(project_id)
        }, {
            $pop: { teams: idx }
        });
        if (updated.modifiedCount != 1) return res.status(404).send({ error: 'Failed to remove user from teams' });

        return res.status(200).send({ message: 'User removed from team successfully' });
    }
    static async leave(req, res) {
        const { user_id } = res.user_session;
        const { project_id } = req.params;

        const project = await dbClient.get('projects', { _id: new ObjectId(project_id) });
        if (!project) return res.status(404).send({ error: 'Not found' });

        const auth = project.teams.find(e => e.toString() == user_id.toString());
        if (!auth) return res.status(401).send({ error: 'Unauthorized' });

        if (project.owner.toString() == user_id.toString()) return res.status(401).send({ error: 'Unauthorized: Intead of that remove project' });

        const idx = project.teams.findIndex(e => e.toString() == user_id.toString());
        if (idx == -1) return res.status(404).send({ error: 'User is not exists' });

        const updated = await dbClient.update('projects', {
            _id: new ObjectId(project_id)
        }, {
            $pop: { teams: idx }
        });

        if (updated.modifiedCount != 1) return res.status(404).send({ error: 'Failed to remove user from teams' });

        return res.status(200).send({ message: 'You left the project successfully' });
    }
}

export default TeamController;