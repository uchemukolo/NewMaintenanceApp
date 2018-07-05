import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
// import token from './ausers.test';

chai.use(chaiHttp);

const { expect } = chai;
let token;

describe('Maintenance Tracker App ::: Request', () => {
  it('should login the user first', (done) => {
    const user = {
      username: 'johndoe',
      password: 'abcd1234'
    };
    chai.request(app)
      .post('/api/v1/auth/login')
      .send(user)
      .end((err, res) => {
        token = res.body.token;
        done();
      });
  });
  describe('Requests', () => {
    it('should not allow user access without token', (done) => {
      chai.request(app)
        .get('/api/v1/users/requests')
        .end((err, res) => {
          const message = 'Unauthorised User! Please provide a valid token';
          expect(res.status).to.equal(401);
          expect(res.body).to.haveOwnProperty('message').to.eql(message);
          done();
        });
    });
    it('should not allow user access with out a valid token', (done) => {
      chai.request(app)
        .get('/api/v1/users/requests')
        .set('token', 'some random stuff')
        .end((err, res) => {
          const message = 'Token could not be authenticated';
          expect(res.status).to.equal(401);
          expect(res.body).to.haveOwnProperty('message').to.eql(message);
          done();
        });
    });
  });
  describe('Create Request', () => {
    it('should not allow user create a request with no Title', (done) => {
      chai.request(app)
        .post('/api/v1/users/requests')
        .send({
          category: 'Repair',
          description: ' My laptop is not coming up. Yesterday everything was working fine but this morning I noticed the laptop was very hot and not coming up',
          urgencyLevel: 'High'
        })
        .set('token', token)
        .end((err, res) => {
          const message = {
            title: [
              'The title field is required.'
            ]
          };
          expect(res.status).to.equal(400);
          expect(res.body).to.haveOwnProperty('message').to.eql(message);
          done();
        });
    });
    it('should not allow user create a request with no Description', (done) => {
      chai.request(app)
        .post('/api/v1/users/requests')
        .send({
          title: 'Faulty Laptop',
          category: 'Repair',
          urgencyLevel: 'High'
        })
        .set('token', token)
        .end((err, res) => {
          const message = {
            description: ['The description field is required.'
            ]
          };
          expect(res.status).to.equal(400);
          expect(res.body).to.haveOwnProperty('message').to.eql(message);
          done();
        });
    });
    it('should not allow user create a request with no Category', (done) => {
      chai.request(app)
        .post('/api/v1/users/requests')
        .send({
          title: 'Faulty Laptop',
          description: ' My laptop is not coming up. Yesterday everything was working fine but this morning I noticed the laptop was very hot and not coming up',
          urgencyLevel: 'High'
        })
        .set('token', token)
        .end((err, res) => {
          const message = {
            category: ['The category field is required.'
            ]
          };
          expect(res.status).to.equal(400);
          expect(res.body).to.haveOwnProperty('message').to.eql(message);
          done();
        });
    });
    it('should not allow user create a request with no Urgency Level', (done) => {
      chai.request(app)
        .post('/api/v1/users/requests')
        .send({
          title: 'Faulty Laptop',
          category: 'Repair',
          description: ' My laptop is not coming up. Yesterday everything was working fine but this morning I noticed the laptop was very hot and not coming up'
        })
        .set('token', token)
        .end((err, res) => {
          const message = {
            urgencyLevel: ['The urgencyLevel field is required.'
            ]
          };
          expect(res.status).to.equal(400);
          expect(res.body).to.haveOwnProperty('message').to.eql(message);
          done();
        });
    });
    it('should  allow user create a request', (done) => {
      chai.request(app)
        .post('/api/v1/users/requests')
        .send({
          title: 'Faulty Laptop',
          category: 'Repair',
          description: ' My laptop is not coming up. Yesterday everything was working fine but this morning I noticed the laptop was very hot and not coming up',
          urgencyLevel: 'High'
        })
        .set('token', token)
        .end((err, res) => {
          const message = 'Request Created Successfully';
          expect(res.status).to.equal(201);
          expect(res.body).to.haveOwnProperty('newRequest');
          expect(res.body).to.haveOwnProperty('message').to.eql(message);
          done();
        });
    });
  });
  describe('Modify Request', () => {
    it('should throw an error if request was not created by user.', (done) => {
      chai.request(app)
        .put('/api/v1/users/requests/30')
        .send({
          title: 'Faulty Laptop',
          category: 'Repair',
          description: ' My laptop is not coming up. Yesterday everything was working fine but this morning I noticed the laptop was very hot and not coming up',
          urgencyLevel: 'High',
        })
        .set('token', token)
        .end((err, res) => {
          const message = 'You are not Authorised to Modify this request!';
          expect(res.status).to.equal(401);
          expect(res.body).to.haveOwnProperty('message').to.eql(message);
          done();
        });
    });
    it('should allow user Modify a request', (done) => {
      chai.request(app)
        .put('/api/v1/users/requests/1')
        .send({
          title: 'Faulty Laptop',
          category: 'Maintenance',
          description: ' My laptop is not coming up. Yesterday everything was working fine but this morning I noticed the laptop was very hot and not coming up',
          urgencyLevel: 'High'
        })
        .set('token', token)
        .end((err, res) => {
          const message = 'Request updated sucessfully';
          expect(res.status).to.equal(200);
          expect(res.body).to.haveOwnProperty('message').to.eql(message);
          done();
        });
    });
  });
  describe('Get All Requests', () => {
    it('should allow user get all requests they created', (done) => {
      chai.request(app)
        .get('/api/v1/users/requests')
        .set('token', token)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.haveOwnProperty('requests');
          done();
        });
    });
  });
  describe('Gets a specific  Request', () => {
    it('return 200 for successful', (done) => {
      chai.request(app)
        .get('/api/v1/users/requests/1')
        .set('token', token)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
    });
    it('should not allow user get a request not created by him/her', (done) => {
      chai.request(app)
        .get('/api/v1/users/requests/6')
        .set('token', token)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
    });
  });
});

