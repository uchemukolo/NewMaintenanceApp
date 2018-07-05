import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);

const { expect } = chai;

export let token;
export let adminToken;

describe('Maintenance Tracker App ::: User', () => {
  describe('Signup ', () => {
    it('should not allow user signup with no email.', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signup')
        .send({
          username: 'johndoe',
          firstName: 'John',
          lastName: 'Doe',
          password: 'abcd1234'
        })
        .end((err, res) => {
          const message = {
            email: [
              'The email field is required.'
            ]
          };
          expect(res.status).to.equal(400);
          expect(res.body).to.haveOwnProperty('message').to.eql(message);
          done();
        });
    });
  });
  it('should not allow user signup with no username.', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@email.com',
        password: 'abcd1234'
      })
      .end((err, res) => {
        const message = {
          username: [
            'The username field is required.'
          ]
        };
        expect(res.status).to.equal(400);
        expect(res.body).to.haveOwnProperty('message').to.eql(message);
        done();
      });
  });
  it('should not allow user signup with no firstName.', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        username: 'johndoe',
        lastName: 'Doe',
        email: 'johndoe@email.com',
        password: 'abcd1234'
      })
      .end((err, res) => {
        const message = {
          firstName: [
            'The firstName field is required.'
          ]
        };
        expect(res.status).to.equal(400);
        expect(res.body).to.haveOwnProperty('message').to.eql(message);
        done();
      });
  });
  it('should not allow user signup with no lastName.', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        username: 'johndoe',
        firstName: 'John',
        email: 'johndoe@email.com',
        password: 'abcd1234'
      })
      .end((err, res) => {
        const message = {
          lastName: [
            'The lastName field is required.'
          ]
        };
        expect(res.status).to.equal(400);
        expect(res.body).to.haveOwnProperty('message').to.eql(message);
        done();
      });
  });
  it('should not allow user signup with no password.', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        username: 'johndoe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@email.com'
      })
      .end((err, res) => {
        const message = {
          password: [
            'The password field is required.'
          ]
        };
        expect(res.status).to.equal(400);
        expect(res.body).to.haveOwnProperty('message').to.eql(message);
        done();
      });
  });
  it('should allow user signup with no errors.', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        username: 'johndoe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@email.com',
        password: 'abcd1234'
      })
      .end((err, res) => {
        const message = 'Signup Successful';
        expect(res.status).to.equal(201);
        expect(res.body).to.haveOwnProperty('message').to.eql(message);
        expect(res.body).to.haveOwnProperty('token');
        expect(res.body).to.haveOwnProperty('newUser');
        done();
        console.log('<<<>>>>>>>>>>>', token);
      });
  });
  it('should not allow user signup with same email or username twice.', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send({
        username: 'johndoe',
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@email.com',
        password: 'abcd1234'
      })
      .end((err, res) => {
        const message = 'User Already Exists, Please Login';
        expect(res.status).to.equal(409);
        expect(res.body).to.haveOwnProperty('message').to.eql(message);
        done();
      });
  });
});
describe('Login', () => {
  it('should not let user login with no password', (done) => {
    const user = {
      username: 'johndoe'
    };
    chai.request(app)
      .post('/api/v1/auth/login')
      .send(user)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
  });
  it('should not let user login with no username or email', (done) => {
    const user = {
      password: 'abcd1234'
    };
    chai.request(app)
      .post('/api/v1/auth/login')
      .send(user)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
  });
  it('should not let user login with wrong credentials', (done) => {
    const user = {
      username: 'johndoe',
      password: 'abcd12'
    };
    chai.request(app)
      .post('/api/v1/auth/login')
      .send(user)
      .end((err, res) => {
        const message = 'Invalid Credentials, Please try again';
        expect(res.status).to.equal(401);
        expect(res.body).to.haveOwnProperty('message').to.eql(message);
        done();
      });
  });
  it('should not let user login with wrong username', (done) => {
    const user = {
      username: 'johndo',
      password: 'abcd1234'
    };
    chai.request(app)
      .post('/api/v1/auth/login')
      .send(user)
      .end((err, res) => {
        const message = 'Invalid Username or Email, please provide valid credentials';
        token = res.body.token;
        expect(res.status).to.equal(401);
        expect(res.body.message).to.equal(message);
        done();
      });
  });
  it('should let user login with no errors', (done) => {
    const user = {
      username: 'johndoe',
      password: 'abcd1234'
    };
    chai.request(app)
      .post('/api/v1/auth/login')
      .send(user)
      .end((err, res) => {
        const message = 'Login Successful!';
        token = res.body.token;
        expect(res.status).to.equal(200);
        expect(res.body).to.haveOwnProperty('message').to.eql(message);
        expect(res.body).to.haveOwnProperty('token');
        expect(res.body).to.haveOwnProperty('userDetails');
        done();
        console.log('>>>>>>>>>>>>>>>', res.body.token);
      });
  });
  it('should let Admin login with no errors', (done) => {
    const admin = {
      username: 'muche',
      password: 'asdf1234'
    };
    chai.request(app)
      .post('/api/v1/auth/login')
      .send(admin)
      .end((err, res) => {
        const message = 'Login Successful!';
        adminToken = res.body.token;
        expect(res.status).to.equal(200);
        expect(res.body).to.haveOwnProperty('message').to.eql(message);
        expect(res.body).to.haveOwnProperty('token');
        expect(res.body).to.haveOwnProperty('userDetails');
        done();
        console.log('>>>>>>>>>>>>>>>', res.body.token);
      });
  });
});

