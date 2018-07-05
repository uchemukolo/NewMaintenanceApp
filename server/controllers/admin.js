import db from '../models/index';

/**
 *
 *@description - Class Definition for the  Admin Request class
 *
 * @export
 *
 * @class Request
 */
class AdminRequest {
  /**
   * @description: Method to get all requests in the database
   *
   * @param {Object} req - request object
   * @param {Object} res - response object
   *
   * @returns {Object} return object as response
   * @memberof AdminRequest
  */
  static getAllRequest(req, res) {
    const allRequests = 'SELECT * from requests';

    db.query(allRequests)
      .then((result) => {
        if (result.rows.length > 0) {
          return res.status(200).send({
            requests: result.rows,
            message: 'All requests successfully retrieved'
          });
        }
        return res.status(200).send({
          message: 'No request in the database'
        });
      })
      .catch((err) => {
        res.status(500).send({
          message: 'Some error occured!',
          error: err.message
        });
      });
  }
  /**
   * @description: Method for approving a request
   *
   * @param {Object} req - request object
   * @param {Object} res - response object
   *
   * @returns {Object} return object as response
   * @memberof AdminRequest
  */
  static approveRequest(req, res) {
    const { requestId } = req.params;
    const approve = {
      text: 'UPDATE requests SET currentStatus = $1 WHERE id = $2 RETURNING *;',
      values: ['Approved', requestId],
    };
    db.query(approve)
      .then((approved) => {
        if (approved) {
          return res.status(200).send({
            request: approved.rows[0],
            message: 'Request has been approved'
          });
        }
        return res.status(404).send({
          message: 'This request has already been approved, check the request details for more info'
        });
      })
      .catch((err) => {
        res.status(500).send({
          message: 'Some error occured!',
          error: err.message
        });
      });
  }
  /**
   * @description: Method for rejecting a request
   *
   * @param {Object} req - request object
   * @param {Object} res - response object
   *
   * @returns {Object} return object as response
   * @memberof AdminRequest
  */
  static disapproveRequest(req, res) {
    const { requestId } = req.params;
    const reject = {
      text: 'UPDATE requests SET currentStatus = $1 WHERE id = $2 RETURNING *;',
      values: ['Disapproved', requestId],
    };
    db.query(reject)
      .then((rejected) => {
        if (rejected) {
          return res.status(200).send({
            request: rejected.rows[0],
            message: 'Request has been Disapproved',
          });
        }
        return res.status(404).send({
          message: 'This request has already been Disapproved, check the request details for more info',
        });
      })
      .catch((err) => {
        res.status(500).send({
          message: 'Some error occured!',
          error: err.message
        });
      });
  }
  /**
   * @description: Method for resolving a request
   *
   * @param {Object} req - request object
   * @param {Object} res - response object
   *
   * @returns {Object} return object as response
   * @memberof AdminRequest
  */
  static resolveRequest(req, res) {
    const { requestId } = req.params;
    const checkResolve = {
      text: 'SELECT * FROM requests WHERE id = $1',
      values: [requestId]
    };
    const resolve = {
      text: 'UPDATE requests SET currentStatus = $1 WHERE id = $2 RETURNING *;',
      values: ['Resolved', requestId],
    };
    db.query(checkResolve)
      .then((response) => {
        if (response.rows[0].currentStatus === 'Resolved' || response.rows[0].currentStatus === 'Disapproved') {
          return res.status(405).send({
            message: 'This request has already been Resolved or disapproved please check request details',
          });
        }
        db.query(resolve)
          .then(resolved => res.status(200).send({
            request: resolved.rows[0],
            message: 'Request has been successfully resolved'
          }));
      })
      .catch((err) => {
        res.status(500).send({
          message: 'Some error occured!',
          error: err.message
        });
      });
  }
}
export default AdminRequest;
