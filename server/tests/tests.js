import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';


chai.use(chaiHttp);

const should = chai.should();
const expect = chai.expect;


describe('API Integration Tests', () => {
  describe('Get All Requests', () => {
    it('return 200 for successful', (done) => {
      chai.request(app)
        .get('/api/v1/users/requests')
        .send()
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
    });
  });
  describe('Gets a specific  Request', () => {
    it('return 200 for successful', (done) => {
      chai.request(app)
        .get('/api/v1/users/requests/1')
        .send()
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
    });
    it('return 404 if request is not found', (done) => {
      chai.request(app)
        .get('/api/v1/users/requests/6')
        .send()
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
    });
  });
  describe('Create a New Request', () => {
    it('return 201 for successful', (done) => {
      chai.request(app)
        .post('/api/v1/users/requests')
        .send({
          userId: 1,
          title: 'Faulty Laptop',
          category: 'Repair',
          description: ' My laptop is not coming up. Yesterday everything was working fine but this morning I noticed the laptop was very hot and not coming up',
          urgencyLevel: 'High',
          date: '11/01/2019'
        })
        .end((err, res) => {
          expect(res.status).to.equal(201);
          done();
        });
    });
  });

  it('should return 400 for no title', (done) => {
    chai.request(app)
      .post('/api/v1/users/requests')
      .send({
        userId: 1,
        category: 'Repair',
        description: ' My laptop is not coming up. Yesterday everything was working fine but this morning I noticed the laptop was very hot and not coming up',
        urgencyLevel: 'High',
        date: '11/01/2019'
      })
      .end((err, res) => {
        const message = {
          title: [
            'The title field is required.'
          ]
        };
        expect(res.status).to.equal(400);
        expect(res.body.should.be.a('object'));
        expect(res.body).to.haveOwnProperty('message').to.eql(message);
        done();
      });
  });

  it('should return 400 for no category', (done) => {
    chai.request(app)
      .post('/api/v1/users/requests')
      .send({
        userId: 1,
        title: 'Faulty Laptop',
        description: ' My laptop is not coming up. Yesterday everything was working fine but this morning I noticed the laptop was very hot and not coming up',
        urgencyLevel: 'High',
        date: '11/01/2019'
      })
      .end((err, res) => {
        const message = {
          category: [
            'The category field is required.'
          ]
        };
        expect(res.status).to.equal(400);
        expect(res.body.should.be.a('object'));
        expect(res.body).to.haveOwnProperty('message').to.eql(message);
        done();
      });
  });

  it('should return 400 for no description', (done) => {
    chai.request(app)
      .post('/api/v1/users/requests')
      .send({
        userId: 1,
        title: 'Faulty Laptop',
        category: 'Repair',
        urgencyLevel: 'High',
        date: '11/01/2019'
      })
      .end((err, res) => {
        const message = {
            description: [
            'The description field is required.'
          ]
        };
        expect(res.status).to.equal(400);
        expect(res.body.should.be.a('object'));
        expect(res.body).to.haveOwnProperty('message').to.eql(message);
        done();
      });
  });

  it('should return 400 for no urgencyLevel', (done) => {
    chai.request(app)
      .post('/api/v1/users/requests')
      .send({
        userId: 1,
        title: 'Faulty Laptop',
        category: 'Repair',
        description: ' My laptop is not coming up. Yesterday everything was working fine but this morning I noticed the laptop was very hot and not coming up',
        date: '11/01/2019'
      })
      .end((err, res) => {
        const message = {
            urgencyLevel: [
            'The urgencyLevel field is required.'
          ]
        };
        expect(res.status).to.equal(400);
        expect(res.body.should.be.a('object'));
        expect(res.body).to.haveOwnProperty('message').to.eql(message);
        done();
      });
  });

  describe('Modify a Request', () => {
    it('return 200 for successful update', (done) => {
      chai.request(app)
        .put('/api/v1/users/requests/1')
        .send({
          title: 'Faulty Laptop',
          category: 'Repair',
          description: ' My laptop is not coming up. Yesterday everything was working fine but this morning I noticed the laptop was very hot and not coming up',
          urgencyLevel: 'High'
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
    });

    it('return 404 if request is not found', (done) => {
        chai.request(app)
          .put('/api/v1/users/requests/6')
          .send()
          .end((err, res) => {
            expect(res.status).to.equal(404);
            done();
          });
      });
    });
  });