import { ObjectId } from "mongodb";
import dbClient from "../utils/db";

class ProjectController {

    static async create(req, res) {
        // Check auth not here but using middleware
        const { name, description } = req.body;
        const { user_id } = res.user_session;

        if (!name || !description) return res.status(401).send({ error: 'Please give the project name and description.' });

        const project = await dbClient.insert('projects', {
            name,
            description,
            owner: user_id,
            teams: [user_id]
        });
        if (!project.acknowledged) return res.status(404).send({ error: 'Failed to create a new project' });

        res.status(200).send({ message: 'Projects craeted successfully' });
    }

    static async get(req, res) {
        const { user_id } = res.user_session;
        const project_id = req.params.id;

        const project = await dbClient.get('projects', { _id: new ObjectId(project_id) });
        if (!project) return res.status(404).send({ error: 'Not found' });

        const auth = project.teams.find(e => e.toString() == user_id.toString());
        if (!auth) return res.status(401).send({ error: 'Unauthorized' });

        return res.status(200).send({ ...project });
    }

    static async delete(req, res) {
        const { user_id } = res.user_session;
        const project_id = req.params.id;

        const project = await dbClient.get('projects', { _id: new ObjectId(project_id) });
        if (!project) return res.status(404).send({ error: 'Not found' });

        if (project.owner.toString() != user_id.toString()) return res.status(401).send({ error: 'Unauthorized' });

        const del = await dbClient.delete('projects', {
            _id: new ObjectId(project_id)
        });

        if (del.deletedCount != 1) return res.status(404).send({ error: 'Failed to delete the project' });

        res.status(200).send({ message: 'Projects deleted successfully' });
    }

    static async edit(req, res) {
        const { user_id } = res.user_session;
        const { name, description } = req.body;
        const project_id = req.params.id;

        if (!name || !description) return res.status(401).send({ error: 'Please give the project name and description.' });

        const project = await dbClient.get('projects', { _id: new ObjectId(project_id) });
        if (!project) return res.status(404).send({ error: 'Not found' });

        if (project.owner.toString() != user_id.toString()) return res.status(401).send({ error: 'Unauthorized' });

        const updated = await dbClient.update('projects', {
            _id: new ObjectId(project_id)
        }, {
            $set: { name, description }
        });

        if (updated.modifiedCount != 1) return res.status(404).send({ error: 'Failed to update the project' });

        res.status(200).send({ message: 'Projects updated successfully' });
    }

    static async get_all(req, res) {
        const { user_id } = res.user_session;

        const projects = await dbClient.db.collection('projects').find({
            teams: { $in: [user_id] }
        }).project({ _id: 1, name: 1, description: 1, owner: 1 }).toArray();

        if (!projects) return res.status(404).send({ error: 'Not found' });

        return res.status(200).send(projects);
    }
}

export default ProjectController;
