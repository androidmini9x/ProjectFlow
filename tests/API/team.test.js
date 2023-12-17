import { v4 as uuidv4 } from 'uuid';
import dbClient from '../../utils/db';
const { expect } = require('chai');
const request = require("request");

const API = 'http://localhost:8000';
const userMock1 = {
    firstname: 'Ahmed',
    lastname: 'Jekko',
    email: 'ahmed@google.com',
    password: '$2b$12$orq7oJTuYhOTFoq2g46Fa.S5Y1qjhPFy/mbpGI6948DdpdwOrXBsa' //123456789
};
const userMock2 = {
    firstname: 'Murad',
    lastname: 'Xeon',
    email: 'murad@google.com',
    password: '$2b$12$orq7oJTuYhOTFoq2g46Fa.S5Y1qjhPFy/mbpGI6948DdpdwOrXBsa' //123456789
};

const projectMock = {
    name: 'Front-end: Deva Company',
    description: 'Redesign new Front-end for Deva Company'
};

describe('Test TeamController', () => {
    let token1;
    let token2;
    let project_id;
    let user_id2;

    before(async () => {
        await dbClient.db.collection('projects').drop();
        await dbClient.db.collection('users').drop();
        await dbClient.db.collection('sessions').drop();
        const user1 = await dbClient.insert('users', userMock1);
        const user2 = await dbClient.insert('users', userMock2);
        const project = await dbClient.insert('projects', {
            ...projectMock,
            owner: user1.insertedId,
            teams: [user1.insertedId, user2.insertedId]
        });
        let session_id = uuidv4();
        await dbClient.insert('sessions', { token: session_id, user_id: user1.insertedId });
        token1 = { 'X-Token': session_id }
        session_id = uuidv4();
        await dbClient.insert('sessions', { token: session_id, user_id: user2.insertedId });
        user_id2 = user2.insertedId;
        project_id = project.insertedId;
        token2 = { 'X-Token': session_id }
    });

    describe('[Get teams]', () => {
        it('Without Auth', (done) => {
            request(
                {
                    url: `${API}/project/${project_id}/teams`,
                    method: 'GET',
                    json: true
                },
                (_, resp, body) => {
                    expect(resp.statusCode).to.be.equal(401);
                    expect(body).to.be.deep.equal({ error: 'Unauthorized' });
                    done();
                }
            );
        });

        it('Without Auth', (done) => {
            request(
                {
                    url: `${API}/project/${project_id}/teams`,
                    method: 'GET',
                    headers: token1,
                    json: true
                },
                (_, resp, body) => {
                    expect(resp.statusCode).to.be.equal(200);
                    expect(body.length).to.be.equal(2);
                    done();
                }
            );
        });
    });

    describe('[Delete teams]', () => {

        it('Non admin try to remove user', (done) => {
            request(
                {
                    url: `${API}/project/${project_id}/teams`,
                    method: 'DELETE',
                    headers: token2,
                    json: { removed_id: user_id2 }
                },
                (_, resp, body) => {
                    expect(resp.statusCode).to.be.equal(401);
                    expect(body).to.be.deep.equal({ error: 'Unauthorized' });
                    done();
                }
            );
        });

        it('Admin try to remove user', (done) => {
            request(
                {
                    url: `${API}/project/${project_id}/teams`,
                    method: 'DELETE',
                    headers: token1,
                    json: { removed_id: user_id2 }
                },
                (_, resp, body) => {
                    expect(resp.statusCode).to.be.equal(200);
                    expect(body).to.be.deep.equal({ message: 'User removed from team successfully' });
                    done();
                }
            );
        });
    });

    describe('[Leave teams]', () => {

        before(async () => {
            await dbClient.db.collection('projects').updateOne(
                { _id: project_id },
                { $push: { teams: user_id2 } }
            );
        })

        it('Admin try to remove himself', (done) => {
            request(
                {
                    url: `${API}/project/${project_id}/teams`,
                    method: 'POST',
                    headers: token1,
                    json: true
                },
                (_, resp, body) => {
                    expect(resp.statusCode).to.be.equal(401);
                    expect(body).to.be.deep.equal({ error: 'Unauthorized: Intead of that remove project' });
                    done();
                }
            );
        });

        it('Admin try to remove user', (done) => {
            request(
                {
                    url: `${API}/project/${project_id}/teams`,
                    method: 'POST',
                    headers: token2,
                    json: true
                },
                (_, resp, body) => {
                    expect(resp.statusCode).to.be.equal(200);
                    expect(body).to.be.deep.equal({ message: 'You left the project successfully' });
                    done();
                }
            );
        });
    });
});