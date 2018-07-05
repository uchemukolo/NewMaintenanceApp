import Validator from 'validatorjs';
import db from '../models/index';
/**
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
  /**
   *
   * @description
   *
   * @param {object} req
   *
   * @param {object} res
   *
   * @param {function} next
   *
   * @returns {object} - JSON object and status code.
   *
   * @memberof Validate
   */
  static checkRequestStatus(req, res, next) {
    const { requestId } = req.params;

    const query = {
      text: 'SELECT * FROM requests WHERE id = $1 AND currentStatus = $2',
      values: [requestId, 'Pending'],
    };
    db.query(query)
      .then((result) => {
        if (result.rows.length === 0 && req.decoded.role === 'Admin') {
          return res.status(405).send({
            message: 'The status of this request has been updated, you cannot approve or disapprove again, please check the Current status',
          });
        }
        if (result.rows.length === 0) {
          return res.status(405).send({
            message: 'Admin has already looked into this request, Please check the current status of the request',
          });
        }
        return next();
      });
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
  static checkApproved(req, res, next) {
    const { requestId } = req.params;
    const query = {
      text: 'SELECT * FROM requests WHERE id = $1 AND currentStatus = $2',
      values: [requestId, 'Approved'],
    };
    db.query(query)
      .then((result) => {
        if (result.rows.length === 0) {
          return res.status(405).send({
            message: 'This request has not been approved, Please check the current status of the request',
          });
        }

        return next();
      });
  }
  // /**
  //  *
  //  * @static
  //  * @param {object} req
  //  *
  //  * @param {object} res
  //  *
  //  * @param {function} next
  //  *
  //  * @returns {object} - JSON object and status code
  //  *
  //  * @memberof Validate
  //  */
  // static resolvedRequest(req, res, next) {
  //   const { requestId } = req.params;

  //   const query = {
  //     text: 'SELECT * FROM requests WHERE id = $1',
  //     values: [requestId]
  //   };

  //   db.query(query)
  //     .then((request) => {
  //       if (request.rows[0].currentStatus === 'Resolved') {
  //         return res.status(400).send({
  //           message: 'Request has already been resolved, it can not be approved',
  //         });
  //       }
  //       return next();
  //     })
  //     .catch((err) => {
  //       res.status(400).send({
  //         message: 'Resolved request cannot be modified',
  //         error: err.message
  //       });
  //     });
  // }
  // /**
  //  *
  //  * @static
  //  * @param {object} req
  //  *
  //  * @param {object} res
  //  *
  //  * @param {function} next
  //  *
  //  * @returns {object} - JSON object and status code
  //  *
  //  * @memberof Validate
  //  */
  // static resolveCheck(req, res, next) {
  //   const { requestId } = req.params;

  //   const query = {
  //     text: 'SELECT * FROM requests WHERE id = $1',
  //     values: [requestId]
  //   };

  //   db.query(query)
  //     .then((request) => {
  //       if (request.rows[0].currentStatus === 'Disapproved' || request.rows[0].status === 'Pending') {
  //         return res.status(400).send({
  //           message: 'Only an approved request can be Resolved',
  //         });
  //       }
  //       return next();
  //     })
  //     .catch((err) => {
  //       res.status(400).send({
  //         message: 'Could not retrieve request',
  //         error: err.message
  //       });
  //     });
  // }
}

export default Validate;
