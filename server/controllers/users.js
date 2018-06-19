import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import Auth from '../middleware/Authetication';
import db from '../models/index';

dotenv.config();
/**
 * @description class for controlling all users routes
 * @class Users
 */
class Users {
  /**
   * @description controls user signup request
   * @param {Object} req request object
   * @param {Object} res response object
   * @return {Object} response containing the registered user
   * @memberof Users
   */
  static signUp(req, res) {
    const {
      firstName,
      lastName,
      email,
      username,
      password
    } = req.body;

    const hashPassword = bcrypt.hashSync(password, 10);
    const errors = {};

    const findOne = {
      text: 'SELECT * FROM users WHERE username = $1 OR email = $2',
      values: [username, email],
    };
    const create = {
      text: 'INSERT INTO users(username, firstName, lastName, email, password) VALUES($1, $2, $3, $4, $5) RETURNING *',
      values: [username, firstName, lastName, email, hashPassword]
    };

    db.query(findOne)
      .then((result) => {
        if (result.rows[0]) {
          if (result.email === email) {
            errors.email = 'Email is already in use';
          }
          if (result.username === username.trim()) {
            errors.username = 'Username already taken';
          }
          return res.status(409).json({
            message: 'User Already Exists, Please Login'
          });
        }
        db.query(create)
          .then((response) => {
            const newUser = {
              username,
              email,
              id: result.rows[0].id,
              firstName: response.rows[0].firstName,
              lastName: response.rows[0].lastName
            };
            const token = Auth.createToken(create);

            res.status(201).json({
              message: 'Signup succesfull',
              newUser,
              token
            });
          });
      })
      .catch((err) => {
        res.status(500).json({
          message: 'Signup Failed',
          error: err.message
        });
      });
  }
  /**
     *@description controls a user's signIn request
     *
     * @param {Object} req request object
     * @param {Object} res response object
     *
     * @return {Object} response containing the logged-in user
     *
     * @memberof Users
     */
  static signIn(req, res) {
    const { username, email, password } = req.body;
    const fetchUser = {
      text: 'SELECT * FROM users WHERE username = $1 OR email = $2',
      values: [username, email],
    };
    db.query(fetchUser)
      .then((result) => {
        if (!result.rows[0]) {
          res.status(401).json({
            message: 'Invalid Username or Email, please provide valid credentials'
          });
        } else if (bcrypt.compareSync(password, result.rows[0].password)) {
          const token = Auth.createToken(result.rows[0]);
          if (!password) {
            res.status(400).json({
              message: 'Wrong Password'
            });
          }
          return res.status(200).json({
            message: 'Login Successful!',
            userDetails: {
              id: result.rows[0].id,
              username: result.rows[0].username,
              email: result.rows[0].email,
              role: result.rows[0].user_role,
              token,
            },
          });
        }
        return res.status(401).json({
          message: 'Invalid Credentials, Please try again'
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: 'Server Error',
          error: err.message
        });
      });
  }
}
export default Users;
