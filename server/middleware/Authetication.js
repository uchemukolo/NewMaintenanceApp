import jwt from 'jsonwebtoken';

require('dotenv').config();

const key = process.env.SECRET_KEY;

const Authenticate = {

  createToken: (userData) => {
    const token = jwt.sign({
      id: userData.id,
      username: userData.username,
      role: userData.role
    }, key, {
      expiresIn: 60 * 60 * 24 // Token expires in 24 hours
    });
    return token;
  },

  Verify: (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers.token;
    if (!token) {
      return res.status(401).json({
        message: 'Unauthorised User! Please provide a valid token'
      });
    }

    jwt.verify(token, key, (err, decoded) => {
      if (err) { 
        return res.status(401).json({
          message: 'Token could not be authenticated'
        });
      }
      req.decoded = decoded;
      next();
    });
  },

  Admin: (req, res, next) => {
    if (req.decoded && req.decoded.role === 'Admin') {
      return next();
    }
    return res.status(401).json({
      message: 'Your not Authorized to access this page!'
    });
  }
};

export default Authenticate;
