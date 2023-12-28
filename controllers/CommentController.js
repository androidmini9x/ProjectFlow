import { ObjectId } from "mongodb";
import dbClient from "../utils/db";

class CommentController {
    static async get(req, res) {
        const { user_id } = res.user_session;
        const { project_id, task_id } = req.params;

        const project = await dbClient.get('projects', { _id: new ObjectId(project_id) });
        if (!project) return res.status(404).send({ error: 'Not found' });

        const auth = project.teams.find(e => e.toString() == user_id.toString());
        if (!auth) return res.status(401).send({ error: 'Unauthorized' });

        const task = await dbClient.get('tasks', { _id: new ObjectId(task_id) });
        if (!task) return res.status(404).send({ error: 'Task not found' });

        const comments = await dbClient.db.collection('comments').aggregate([
            {$match: {task_id: task._id}},
            {$lookup: {from: "users", localField: "user_id", foreignField: "_id", as: "user"}},
            {$unwind: "$user"},
            {$project: {"user.password": 0, "user._id": 0}}
        ]).toArray();

        return res.status(200).send({ ...task, comments });
    }

    static async post(req, res) {
        const { user_id } = res.user_session;
        const { project_id, task_id } = req.params;
        const { comment } = req.body;

        const project = await dbClient.get('projects', { _id: new ObjectId(project_id) });
        if (!project) return res.status(404).send({ error: 'Not found' });

        const auth = project.teams.find(e => e.toString() == user_id.toString());
        if (!auth) return res.status(401).send({ error: 'Unauthorized' });

        const task = await dbClient.get('tasks', { _id: new ObjectId(task_id) });
        if (!task) return res.status(404).send({ error: 'Task not found' });

        if (!comment) return res.status(401).send({ error: 'Comment is required fields.' });

        const cm = await dbClient.insert('comments', {
            user_id,
            text: comment,
            task_id: task._id,
            created_at: new Date()
        });

        if (!cm.acknowledged) return res.status(404).send({ error: 'Failed to create a new comment' });

        return res.status(200).send({ message: 'Comment craeted successfully', comment_id: cm.insertedId });
    }
}

export default CommentController;
