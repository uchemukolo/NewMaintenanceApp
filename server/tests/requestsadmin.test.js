import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import { token, adminToken } from './ausers.test';

chai.use(chaiHttp);

const { expect } = chai;

describe('Maintenance Tracker App ::: Admin Requests', () => {
  it('should not get request if user is not login', (done) => {
    chai.request(app)
      .get('/api/v1/users/requests')
      .set('token', 'some stuff as token')
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.a.property('message');
        expect(res.body.message).to.equal('Token could not be authenticated');
        done();
      });
  });
  it('should not get request all request if user is not an admin', (done) => {
    chai.request(app)
      .get('/api/v1/requests')
      .set('token', token)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body).to.have.a.property('message');
        expect(res.body.message).to.equal('Your not Authorized to access this page!');
        done();
      });
  });
  it('should get all request for admin', (done) => {
    chai.request(app)
      .get('/api/v1/requests')
      .set('token', adminToken)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.a.property('requests')
        expect(res.body).to.have.a.property('message');
        expect(res.body.message).to.equal('All requests successfully retrieved');
        done();
      });
  });
  describe('PUT /api/v1/requests/:requestId/approve', () => {
    it('should not approve a request when user not authenticated', (done) => {
      const requestId = 14;
      chai.request(app)
        .put(`/api/v1/requests/${requestId}/approve`)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.have.a.property('message');
          expect(res.body.message).to.equal('Unauthorised User! Please provide a valid token');
          done();
        });
    });
    it('should not approve a request if user is not an admin', (done) => {
      const requestId = 67;
      chai.request(app)
        .put(`/api/v1/requests/${requestId}/approve`)
        .set('token', token)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.have.a.property('message');
          expect(res.body.message).to.equal('Your not Authorized to access this page!');
          done();
        });
    });
    it('should not approve a request that the status has changed from pending', (done) => {
      const requestId = 43;
      chai.request(app)
        .put(`/api/v1/requests/${requestId}/approve`)
        .set('token', adminToken)
        .end((err, res) => {
          expect(res.status).to.equal(405);
          expect(res.body).to.have.a.property('message');
          expect(res.body.message).to.equal('The status of this request has been updated, you cannot approve or disapprove again, please check the Current status');
          done();
        });
    });
    it('should approve a request if user is an admin', (done) => {
      const requestId = 1;
      chai.request(app)
        .put(`/api/v1/requests/${requestId}/approve`)
        .set('token', adminToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.a.property('message');
          expect(res.body.message).to.equal('Request has been approved');
          done();
        });
    });
  });

  describe('PUT /api/v1/requests/:requestId/resolve', () => {
    it('should  allow user create a request that is approved', (done) => {
      chai.request(app)
        .post('/api/v1/users/requests')
        .send({
          title: 'Faulty Air Condition',
          category: 'Maintenance',
          description: ' Some text to describe the problem',
          urgencyLevel: 'High',
          currentStatus: 'Approved'
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
    it('should not resolve a request when user not authenticated', (done) => {
      const requestId = 34;
      chai.request(app)
        .put(`/api/v1/requests/${requestId}/resolve`)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.have.a.property('message');
          expect(res.body.message).to.equal('Unauthorised User! Please provide a valid token');
          done();
        });
    });
    it('should not resolve a request if user is not an admin', (done) => {
      const requestId = 12;
      chai.request(app)
        .put(`/api/v1/requests/${requestId}/resolve`)
        .set('token', 'some random stuff as token')
        .send({
          title: 'Faulty AC',
          category: 'Maintenance',
          description: ' Some text explaining the dicription of the problem',
          urgencyLevel: 'Medium'
        })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.have.a.property('message');
          expect(res.body.message).to.equal('Token could not be authenticated');
          done();
        });
    });
    it('should not resolve a pending request', (done) => {
      const requestId = 54;
      chai.request(app)
        .put(`/api/v1/requests/${requestId}/resolve`)
        .set('token', adminToken)
        .end((err, res) => {
          expect(res.status).to.equal(405);
          expect(res.body).to.have.a.property('message');
          expect(res.body.message).to.equal('This request has not been approved, Please check the current status of the request');
          done();
        });
    });
    it('should resolve a request if user is an admin', (done) => {
      const requestId = 1;
      chai.request(app)
        .put(`/api/v1/requests/${requestId}/resolve`)
        .set('token', adminToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.a.property('message');
          expect(res.body.message).to.equal('Request has been successfully resolved');
          done();
        });
    });
    it('should not resolve a request that is not approved', (done) => {
      const requestId = 1;
      chai.request(app)
        .put(`/api/v1/requests/${requestId}/resolve`)
        .set('token', adminToken)
        .end((err, res) => {
          expect(res.status).to.equal(405);
          expect(res.body).to.have.a.property('message');
          expect(res.body.message).to.equal('This request has not been approved, Please check the current status of the request');
          done();
        });
    });
    it('should not resolve a rejected request', (done) => {
      const requestId = 43;
      chai.request(app)
        .put(`/api/v1/requests/${requestId}/resolve`)
        .set('token', adminToken)
        .end((err, res) => {
          expect(res.status).to.equal(405);
          expect(res.body).to.have.a.property('message');
          expect(res.body.message).to.equal('This request has not been approved, Please check the current status of the request');
          done();
        });
    });
  });
  describe('PUT /api/v1/requests/:requestId/disapprove', () => {
    it('should not disapprove a request when user not authenticated', (done) => {
      const requestId = 14;
      chai.request(app)
        .put(`/api/v1/requests/${requestId}/disapprove`)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.have.a.property('message');
          expect(res.body.message).to.equal('Unauthorised User! Please provide a valid token');
          done();
        });
    });
    it('should not disapprove a request if user is not an admin', (done) => {
      const requestId = 16;
      chai.request(app)
        .put(`/api/v1/requests/${requestId}/disapprove`)
        .set('token', token)
        .send({
          title: 'Faulty AC',
          category: 'Maintenance',
          description: ' Some text explaining the dicription of the problem',
          urgencyLevel: 'Medium'
        })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.have.a.property('message');
          expect(res.body.message).to.equal('Your not Authorized to access this page!');
          done();
        });
    });
    it('should disapprove a request that the status is not pending', (done) => {
      const requestId = 1;
      chai.request(app)
        .put(`/api/v1/requests/${requestId}/disapprove`)
        .set('token', adminToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.a.property('message');
          expect(res.body.message).to.equal('Request has been Disapproved');
          done();
        });
    });
    it('should disapprove a request if user is an admin', (done) => {
      const requestId = 1;
      chai.request(app)
        .put(`/api/v1/requests/${requestId}/disapprove`)
        .set('token', adminToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.a.property('message');
          expect(res.body.message).to.equal('Request has been Disapproved');
          done();
        });
    });
  });
});
