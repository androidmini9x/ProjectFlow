import { ObjectId } from "mongodb";
import dbClient from "../utils/db";

class TaskController {
    static async get(req, res) {
        const { user_id } = res.user_session;
        const { project_id, task_id } = req.params;

        const project = await dbClient.get('projects', { _id: new ObjectId(project_id) });
        if (!project) return res.status(404).send({ error: 'Not found' });

        const auth = project.teams.find(e => e.toString() == user_id.toString());
        if (!auth) return res.status(401).send({ error: 'Unauthorized' });

        const task = await dbClient.get('tasks', { _id: new ObjectId(task_id) });
        if (!task) return res.status(404).send({ error: 'Task not found' });


        return res.status(200).send({ ...task });
    }

    static async create(req, res) {
        const { user_id } = res.user_session;
        const { project_id } = req.params;
        const { name, description, start, end } = req.body;

        if (!name || !start || !end) return res.status(401).send({ error: 'Please all the required fields.' });

        const project = await dbClient.get('projects', { _id: new ObjectId(project_id) });
        if (!project) return res.status(404).send({ error: 'Not found' });

        if (project.owner.toString() != user_id.toString()) return res.status(401).send({ error: 'Unauthorized' });

        const task = await dbClient.insert('tasks', {
            name, description, start, end, project_id: project._id, owner: user_id
        });

        if (!task.acknowledged) return res.status(404).send({ error: 'Failed to create a new task' });

        return res.status(200).send({ message: 'Task craeted successfully', task_id: task.insertedId });
    }

    static async edit(req, res) {
        const { user_id } = res.user_session;
        const { project_id, task_id } = req.params;
        const { name, description, start, end } = req.body;

        const project = await dbClient.get('projects', { _id: new ObjectId(project_id) });
        if (!project) return res.status(404).send({ error: 'Not found' });
        if (project.owner.toString() != user_id.toString()) return res.status(401).send({ error: 'Unauthorized' });

        const task = await dbClient.get('tasks', { _id: new ObjectId(task_id) });
        if (!task) return res.status(404).send({ error: 'Task not found' });

        const updated = await dbClient.update('tasks', {
            _id: new ObjectId(task_id)
        }, {
            $set: { name, description, start, end }
        });
        if (updated.modifiedCount != 1) return res.status(404).send({ error: 'Failed to update the project' });

        return res.status(200).send({ message: 'Tasks updated successfully' });
    }
    static async delete(req, res) {
        const { user_id } = res.user_session;
        const { project_id, task_id } = req.params;

        const project = await dbClient.get('projects', { _id: new ObjectId(project_id) });
        if (!project) return res.status(404).send({ error: 'Not found' });

        if (project.owner.toString() != user_id.toString()) return res.status(401).send({ error: 'Unauthorized' });

        const del = await dbClient.delete('tasks', {
            _id: new ObjectId(task_id)
        });

        if (del.deletedCount != 1) return res.status(404).send({ error: 'Failed to delete the project' });

        return res.status(200).send({ message: 'Task deleted successfully' });
    }

    static async get_all(req, res) {
        const { user_id } = res.user_session;
        const { project_id } = req.params;

        const project = await dbClient.get('projects', { _id: new ObjectId(project_id) });
        if (!project) return res.status(404).send({ error: 'Not found' });

        const auth = project.teams.find(e => e.toString() == user_id.toString());
        if (!auth) return res.status(401).send({ error: 'Unauthorized' });

        const tasks = await dbClient.db.collection('tasks').find({ project_id: new ObjectId(project_id) }).limit(5).toArray();

        if (!tasks) return res.status(404).send({ error: 'Failed to fetch tasks' });

        return res.status(200).send(tasks);
    }
}

export default TaskController;