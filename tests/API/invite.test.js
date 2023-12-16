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
    let invitation_id;

    before(async () => {
        await dbClient.db.collection('projects').drop();
        await dbClient.db.collection('users').drop();
        await dbClient.db.collection('sessions').drop();
        await dbClient.db.collection('teams').drop();
        await dbClient.db.collection('invitations').drop();
        const user1 = await dbClient.insert('users', userMock1);
        const user2 = await dbClient.insert('users', userMock2);
        const project = await dbClient.insert('projects', {
            ...projectMock,
            owner: user1.insertedId,
            teams: [user2.insertedId]
        });
        let session_id = uuidv4();
        await dbClient.insert('sessions', { token: session_id, user_id: user1.insertedId });
        token1 = { 'X-Token': session_id }
        session_id = uuidv4();
        await dbClient.insert('sessions', { token: session_id, user_id: user2.insertedId });
        project_id = project.insertedId;
        token2 = { 'X-Token': session_id }
    });

    describe('[Create Invitation]', () => {
        it('Without Auth', (done) => {
            request(
                {
                    url: `${API}/project/${project_id}/invite`,
                    method: 'POST',
                    json: { email: userMock2.email }
                },
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
                    url: `${API}/project/${project_id}/invite`,
                    method: 'POST',
                    headers: token1,
                    json: { email: 'test@test.com' }
                },
                (_, resp, body) => {
                    expect(resp.statusCode).to.be.equal(404);
                    expect(body).to.be.deep.equal({ error: 'This email is not register in our platform' });
                    done();
                }
            );
        });

        it('With correct input', (done) => {
            request(
                {
                    url: `${API}/project/${project_id}/invite`,
                    method: 'POST',
                    headers: token1,
                    json: { email: userMock2.email }
                },
                (_, resp, body) => {
                    expect(resp.statusCode).to.be.equal(200);
                    expect(body.message).to.be.equal('Invitation created successfully');
                    invitation_id = body.invitation;
                    done();
                }
            );
        });
    });

    describe('[Accept invitation]', () => {
        it('Accept invitation for not allowed user', (done) => {
            request(
                {
                    url: `${API}/project/invitation/${invitation_id} `,
                    method: 'GET',
                    headers: token1,
                    json: true
                },
                (_, resp, body) => {
                    expect(resp.statusCode).to.be.equal(404);
                    expect(body).to.be.deep.equal({ error: 'This invitation is expired' });
                    done();
                }
            );
        });

        it('Accept invitation for allowed user', (done) => {
            request(
                {
                    url: `${API}/project/invitation/${invitation_id} `,
                    method: 'GET',
                    headers: token2,
                    json: true
                },
                (_, resp, body) => {
                    expect(resp.statusCode).to.be.equal(200);
                    expect(body.message).to.be.deep.equal('Invitation Accepted');
                    done();
                }
            );
        });
    });

    describe('[Revoke Invitation]', () => {
        it('Revoke Invitation by not the owner', (done) => {
            request(
                {
                    url: `${API}/project/invitation/${invitation_id}`,
                    method: 'DELETE',
                    headers: token2,
                    json: true
                },
                (_, resp, body) => {
                    expect(resp.statusCode).to.be.equal(401);
                    expect(body).to.be.deep.equal({ error: 'Unauthorized' });
                    done();
                }
            );
        });

        it('Revoke Invitation by owner', (done) => {
            request(
                {
                    url: `${API}/project/invitation/${invitation_id}`,
                    method: 'DELETE',
                    headers: token1,
                    json: true
                },
                (_, resp, body) => {
                    expect(resp.statusCode).to.be.equal(200);
                    expect(body).to.be.deep.equal({ message: 'Invitation revoked successfully' });
                    done();
                }
            );
        });
    });

    describe('[Get All invitations]', () => {
        before(async () => {

        });
        it('Get all invitation by normal user', (done) => {
            request(
                {
                    url: `${API}/project/${project_id}/invitation`,
                    method: 'GET',
                    headers: token2,
                    json: true
                },
                (_, resp, body) => {
                    expect(resp.statusCode).to.be.equal(401);
                    expect(body).to.be.deep.equal({ error: 'Unauthorized' });
                    done();
                }
            );
        });

        it('Get all invitation by project owner', (done) => {
            request(
                {
                    url: `${API}/project/${project_id}/invitation`,
                    method: 'GET',
                    headers: token1,
                    json: true
                },
                (_, resp, body) => {
                    expect(resp.statusCode).to.be.equal(200);
                    expect(body).to.be.deep.equal([]);
                    done();
                }
            );
        });
    });
});