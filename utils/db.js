const { MongoClient } = require('mongodb');

const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_PORT = process.env.DB_PORT || 27017;
const DB_DATABASE = process.env.DB_DATABASE || 'project_planner';
const url = `mongodb://${DB_HOST}:${DB_PORT}`;

class DBClient {
    constructor() {
        this.client = new MongoClient(url, { monitorCommands: true });
        this.db = this.client.db(DB_DATABASE);
        this.status = false;
        this.db.command({ ping: 1 })
            .then(() => {
                console.log("Database is connected");
                this.status = true;
            })
            .catch(() => console.log('Error: database refuse to connect'));
    }

    isAlive() {
        return this.status;
    }

    async insert(collection, data) {
        const documents = this.db.collection(collection);
        const inserted = await documents.insertOne(data);
        return inserted;
    }

    async get(collection, id) {
        const documents = this.db.collection(collection);
        const data = await documents.findOne(id);
        return data;
    }

    async update(collection, filter, update) {
        const documents = this.db.collection(collection);
        const data = await documents.updateOne(filter, update);
        return data;
    }

    async delete(collection, id) {
        const documents = this.db.collection(collection);
        const data = await documents.deleteOne(id);
        return data;
    }
}

const dbClient = new DBClient();

export default dbClient;
