import dbClient from '../../utils/db';
const { expect } = require('chai');
const request = require("request");

const API = 'http://localhost:8000';
const userMock = {
    firstname: 'Ahmed',
    lastname: 'Jekko',
    email: 'ahmed@google.com',
    password: '123456789'
}

describe('Test Usercontroller [Register]', () => {

    before(async () => {
        await dbClient.db.collection('users').drop();
    });

    it('When first name is missing', (done) => {
        request.post(`${API}/register`,
            { json: { ...userMock, firstname: '' } },
            (_, resp, body) => {
                expect(resp.statusCode).to.be.equal(400);
                expect(body).to.be.deep.equal({ error: 'Missing first name' });
                done();
            });
    });

    it('When last name is missing', (done) => {
        request.post(`${API}/register`,
            { json: { ...userMock, lastname: '' } },
            (_, resp, body) => {
                expect(resp.statusCode).to.be.equal(400);
                expect(body).to.be.deep.equal({ error: 'Missing last name' });
                done();
            });
    });

    it('When email is missing', (done) => {
        request.post(`${API}/register`,
            { json: { ...userMock, email: '' } },
            (_, resp, body) => {
                expect(resp.statusCode).to.be.equal(400);
                expect(body).to.be.deep.equal({ error: 'Missing email' });
                done();
            });
    });

    it('When password name is missing', (done) => {
        request.post(`${API}/register`,
            { json: { ...userMock, password: '' } },
            (_, resp, body) => {
                expect(resp.statusCode).to.be.equal(400);
                expect(body).to.be.deep.equal({ error: 'Missing password' });
                done();
            });
    });

    it('Register new user', (done) => {
        request.post(`${API}/register`,
            { json: userMock },
            (_, resp, body) => {
                expect(resp.statusCode).to.be.equal(201);
                expect(body).to.be.deep.equal({ message: 'Registration successful' });
                done();
            });
    });

    it('Register user with the same email', (done) => {
        request.post(`${API}/register`,
            { json: userMock },
            (_, resp, body) => {
                expect(resp.statusCode).to.be.equal(400);
                expect(body).to.be.deep.equal({ error: 'This email is already exist' });
                done();
            });
    });

});


describe.only('Test Usercontroller [#Login]', () => {

    before(async () => {
        await dbClient.db.collection('users').drop();
        await dbClient.insert('users', { ...userMock, password: '$2b$12$orq7oJTuYhOTFoq2g46Fa.S5Y1qjhPFy/mbpGI6948DdpdwOrXBsa' });
    });

    it('Login in with mock user', (done) => {
        request.post(`${API}/login`,
            { json: { email: userMock.email, password: userMock.password } },
            (_, resp, __) => {
                expect(resp.statusCode).to.be.equal(200);
                done();
            }
        );
    });

    it('Login in with wrong info', (done) => {
        request.post(`${API}/login`,
            { json: { email: userMock.email, password: '@!$#@!' } },
            (_, resp, body) => {
                expect(resp.statusCode).to.be.equal(401);
                expect(body).to.be.deep.equal({ error: 'User with given info not found' });
                done();
            }
        );
    });

    it('Login in with empty data', (done) => {
        request.post(`${API}/login`,
            { json: { email: '', password: '' } },
            (_, resp, body) => {
                expect(resp.statusCode).to.be.equal(404);
                expect(body).to.be.deep.equal({ error: 'You should use email & password to sign in' });
                done();
            }
        );
    });

});