import dbClient from '../../utils/db';

const { expect } = require('chai');

const wait = (t) => new Promise((resolve) => setTimeout(() => resolve(), t));

describe('Test database connection', () => {

    before(function (done) {
        this.timeout(10000);
        wait(3000)
            .then(() => {
                done();
            }).catch(done);
    })

    it('Connect succesful', () => {
        expect(dbClient.isAlive()).to.be.equal(true);
    });
});

describe('Test: CRUD on database', () => {
    const user = {
        firstname: 'Ahmed',
        lastname: 'Tush',
        email: 'ahmed@google.com',
        password: '123456789',
    }

    it('Insert data', async () => {
        const data = await dbClient.insert('test', user);

        expect(data.acknowledged).to.be.equal(true);
    });

    it('Get data from database', async () => {
        const data = await dbClient.get('test', {
            email: 'ahmed@google.com'
        });
        expect(data.email).to.be.equal(user.email);
    });

    it('Update data from database', async () => {
        const data = await dbClient.update('test', {
            email: 'ahmed@google.com'
        }, {
            $set: { firstname: 'Mahmod' }
        });
        expect(data.modifiedCount).to.be.equal(1);
    });

    it('Delete data from database', async () => {
        const data = await dbClient.delete('test', {
            email: 'ahmed@google.com'
        });
        expect(data.deletedCount).to.be.equal(1);
    });

});