import dbClient from '../../utils/db';
const { expect } = require('chai');
const request = require("request");

const API = 'http://localhost:8000';
const userMock = {
    firstname: 'Ahmed',
    lastname: 'Jekko',
    email: 'ahmed@google.com',
    password: '$2b$12$orq7oJTuYhOTFoq2g46Fa.S5Y1qjhPFy/mbpGI6948DdpdwOrXBsa' //123456789
}

const projectMock = {
    name: 'Front-end: Deva Company',
    description: 'Redesign new Front-end for Deva Company'
}

describe('Test ProjectController', () => {
    let token;
    let project_id;

    before(async () => {
        await dbClient.db.collection('projects').drop();
        await dbClient.db.collection('teams').drop();
        await dbClient.db.collection('users').drop();
        await dbClient.db.collection('sessions').drop();
        const user = await dbClient.insert('users', userMock);
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
            request.post(`${API}/project/create`,
                { json: projectMock },
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
                    url: `${API}/project/create`,
                    method: 'POST',
                    headers: token,
                    json: { name: '', description: 'Hello, Worl' }
                },
                (_, resp, body) => {
                    expect(resp.statusCode).to.be.equal(401);
                    expect(body).to.be.deep.equal({ error: 'Please give the project name and description.' });
                    done();
                }
            );
        });

        it('With correct input', (done) => {
            request(
                {
                    url: `${API}/project/create`,
                    method: 'POST',
                    headers: token,
                    json: projectMock
                },
                (_, resp, body) => {
                    expect(resp.statusCode).to.be.equal(200);
                    expect(body).to.be.deep.equal({ message: 'Projects craeted successfully' });
                    done();
                }
            );
        });
    });

    describe('[Get Project]', () => {

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
            request(
                {
                    url: `${API}/project/${project_id}`,
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
                    url: `${API}/project/${project_id}`,
                    method: 'GET',
                    headers: token,
                    json: true
                },
                (_, resp, body) => {
                    expect(resp.statusCode).to.be.equal(200);
                    expect(body.name).to.be.equal(projectMock.name);
                    expect(body._id).to.be.equal(String(project_id));
                    done();
                }
            );
        });
    });

    describe('[Update Project]', () => {
        it('Without Auth', (done) => {
            request(
                {
                    url: `${API}/project/${project_id}`,
                    method: 'PUT',
                    json: { name: 'New Changed Name' }
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
                    url: `${API}/project/${project_id}`,
                    method: 'PUT',
                    headers: token,
                    json: { name: 'New Changed Name', description: 'New Description' }
                },
                (_, resp, body) => {
                    expect(resp.statusCode).to.be.equal(200);
                    expect(body).to.be.deep.equal({ message: 'Projects updated successfully' });
                    done();
                }
            );
        });
    });

    describe('[Delete Project]', () => {
        it('Without Auth', (done) => {
            request(
                {
                    url: `${API}/project/${project_id}`,
                    method: 'DELETE',
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
                    url: `${API}/project/${project_id}`,
                    method: 'DELETE',
                    headers: token,
                    json: true
                },
                (_, resp, body) => {
                    expect(resp.statusCode).to.be.equal(200);
                    expect(body).to.be.deep.equal({ message: 'Projects deleted successfully' });
                    done();
                }
            );
        });
    });
});