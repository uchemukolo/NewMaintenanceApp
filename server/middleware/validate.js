import Validator from 'validatorjs';
/**
 *
 *
 * @class Validate
 */
class Validate {
  /**
   *
   * @param {object} req
   *
   * @param {object} res
   *
   * @param {function} next
   *
   * @returns {object} - JSON object and status code
   *
   * @memberof Validate
   */
  static signUp(req, res, next) {
    const {
      username,
      firstName,
      lastName,
      email,
      password

    } = req.body;

    const userData = {
      username,
      firstName,
      lastName,
      email,
      password
    };

    const userDataRules = {
      username: 'required|string|min:5',
      firstName: 'required|string|alpha|min:2',
      lastName: 'required|string|alpha|min:2',
      email: 'required|string|email',
      password: 'required|min:6'
    };

    const validation = new Validator(userData, userDataRules);
    if (validation.passes()) {
      next();
    } else {
      const errors = validation.errors.all();
      return res.status(400)
        .send({ message: errors });
    }
  }
  /**
   *
   * @static
   * @param {object} req
   *
   * @param {object} res
   *
   * @param {function} next
   *
   * @returns {object} - JSON object and status code
   *
   * @memberof Validate
   */
  static signIn(req, res, next) {
    const {
      username,
      email,
      password
    } = req.body;

    const userData = {
      username: (username || email),
      password
    };

    const userDataRules = {
      username: 'required|string',
      password: 'required|min:6',
    };

    const validation = new Validator(userData, userDataRules);
    if (validation.passes()) {
      next();
    } else {
      const errors = validation.errors.add();
      return res.status(400)
        .send({ message: errors });
    }
  }
  /**
   *
   *
   * @static
   * @param {object} req
   *
   * @param {object} res
   *
   * @param {function} next
   *
   * @returns {object} - JSON object and status code
   *
   * @memberof Validate
  */
  static createRequest(req, res, next) {
    const {
      title, category, description, urgencyLevel, currentStatus
    } = req.body;

    const createData = {
      title, category, urgencyLevel, description, currentStatus
    };

    const createDataRules = {
      title: 'required|string|min:6',
      category: ['required', { in: ['Repair', 'Maintenance'] }],
      urgencyLevel: ['required', { in: ['High', 'Medium', 'Low'] }],
      description: 'required|string|min:10'
    };

    const validation = new Validator(createData, createDataRules);
    if (validation.passes()) {
      next();
    } else {
      const errors = validation.errors.all();
      return res.status(400)
        .send({ message: errors });
    }
  }
}

export default Validate;
