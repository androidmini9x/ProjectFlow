import dbClient from '../../utils/db';
const { expect } = require('chai');
const request = require("request");

const API = 'http://localhost:8000';
const userMock = {
    firstname: 'Ahmed',
    lastname: 'Jekko',
    email: 'ahmed@google.com',
    password: '$2b$12$orq7oJTuYhOTFoq2g46Fa.S5Y1qjhPFy/mbpGI6948DdpdwOrXBsa' //123456789
};

const projectMock = {
    name: 'Front-end: Deva Company',
    description: 'Redesign new Front-end for Deva Company'
};

const taskMock = {
    name: 'Task 1',
    description: 'Redesign new Front-end for Deva Company',
    start: '2019',
    end: '2020'
}

describe('Test TaskController', () => {
    let token;
    let project_id;
    let task_id;
    let user_id;

    before(async () => {
        await dbClient.db.collection('projects').drop();
        await dbClient.db.collection('teams').drop();
        await dbClient.db.collection('users').drop();
        await dbClient.db.collection('sessions').drop();
        await dbClient.db.collection('tasks').drop();
        const user = await dbClient.insert('users', userMock);
        user_id = user.insertedId;
        const project = await dbClient.insert('projects', {
            ...projectMock,
            owner: user.insertedId,
            teams: [user.insertedId]
        });
        project_id = project.insertedId;
    });

    describe('[Create]', () => {
        before((done) => {
            request.post(`${API}/login`,
                { json: { email: userMock.email, password: '123456789' } },
                (_, __, body) => {
                    token = { 'X-Token': body.token };
                    done();
                }
            );
        });

        it('Without Auth', (done) => {
            request.post(`${API}/project/${project_id}/task`,
                { json: taskMock },
                (_, resp, body) => {
                    expect(resp.statusCode).to.be.equal(401);
                    expect(body).to.be.deep.equal({ error: 'Unauthorized' });
                    done();
                }
            );
        });

        it('With wrong input', (done) => {
            request(
                {
                    url: `${API}/project/${project_id}/task`,
                    method: 'POST',
                    headers: token,
                    json: { name: 'Tasks', description: 'Hello, Worl' }
                },
                (_, resp, body) => {
                    expect(resp.statusCode).to.be.equal(401);
                    expect(body).to.be.deep.equal({ error: 'Please all the required fields.' });
                    done();
                }
            );
        });

        it('With correct input', (done) => {
            request(
                {
                    url: `${API}/project/${project_id}/task`,
                    method: 'POST',
                    headers: token,
                    json: { ...taskMock, project_id }
                },
                (_, resp, body) => {
                    task_id = body.task_id;
                    expect(resp.statusCode).to.be.equal(200);
                    expect(body.message).to.be.equal('Task craeted successfully');
                    done();
                }
            );
        });
    });

    describe('[Get Task]', () => {
        it('Without Auth', (done) => {
            request(
                {
                    url: `${API}/project/${project_id}/task/${task_id}`,
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


        it('With Auth', (done) => {
            request(
                {
                    url: `${API}/project/${project_id}/task/${task_id}`,
                    method: 'GET',
                    headers: token,
                    json: true
                },
                (_, resp, body) => {
                    expect(resp.statusCode).to.be.equal(200);
                    expect(body._id).to.be.equal(task_id);
                    done();
                }
            );
        });
    });

    describe('[Update Task]', () => {
        it('Change Input', (done) => {
            request(
                {
                    url: `${API}/project/${project_id}/task/${task_id}`,
                    method: 'PUT',
                    headers: token,
                    json: { ...taskMock, name: 'Hello, World' }
                },
                (_, resp, body) => {
                    expect(resp.statusCode).to.be.equal(200);
                    expect(body).to.be.deep.equal({ message: 'Tasks updated successfully' });
                    done();
                }
            );
        });
    });

    describe('[Delete Task]', () => {
        it('Change Input', (done) => {
            request(
                {
                    url: `${API}/project/${project_id}/task/${task_id}`,
                    method: 'DELETE',
                    headers: token,
                    json: true
                },
                (_, resp, body) => {
                    expect(resp.statusCode).to.be.equal(200);
                    expect(body).to.be.deep.equal({ message: 'Task deleted successfully' });
                    done();
                }
            );
        });
    });

    describe('Test TaskController', () => {
        before(async () => {
            await dbClient.db.collection('tasks').insertMany([
                { ...taskMock, project_id, owner: user_id, },
                { ...taskMock, project_id, owner: user_id, },
                { ...taskMock, project_id, owner: user_id, },
                { ...taskMock, project_id, owner: user_id, },
                { ...taskMock, project_id, owner: user_id, },
                { ...taskMock, project_id, owner: user_id, }
            ]);
        })

        it('Get All Task for specific project', (done) => {
            request(
                {
                    url: `${API}/project/${project_id}/task`,
                    method: 'GET',
                    headers: token,
                    json: true
                },
                (_, resp, body) => {
                    expect(resp.statusCode).to.be.equal(200);
                    expect(body.length).to.be.equal(5);
                    done();
                }
            );
        });
    });

});