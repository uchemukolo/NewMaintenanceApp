import db from '../models/index';

/**
 *
 *@description - Class Definition for the Request class
 *
 * @export
 *
 * @class Request
 */
class Request {
/**
  *@description - create a new request of a logged in user
   *@param {object} req - request object
   *
   * @param {object} res - responce object
   *
   * @return {object} return object as response
   *
   * @memberof Request
   */
  static createRequest(req, res) {
    const {
      title, category, description, urgencyLevel
    } = req.body;

    const create = {
      text: 'INSERT INTO requests(title, category, description, urgencyLevel, userId) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      values: [title, category, description, urgencyLevel, req.decoded.id]
    };

    db.query(create)
      .then((response) => {
        res.status(201).send({
          message: 'Request Created Successfully',
          newRequest: {
            id: response.rows[0].id,
            userId: req.decoded.id,
            status: response.rows[0].currentStatus,
            title,
            category,
            description,
            urgencyLevel
          }
        });
      })
      .catch((err) => {
        res.status(500).send({
          message: 'Create Request Failed',
          error: err.message
        });
      });
  }
  /**
   *@description - Modify details of a request
   *@param {object} req - request object
   *
   * @param {object} res - responce object
   *
   * @return {object} return object as response
   *
   * @memberof Request
     */
  static modifyRequest(req, res) {
    const { requestId } = req.params;
    const updateFields = req.body;
    const {
      title, category, description, urgencyLevel
    } = req.body;

    const existingRequest = {
      text: 'SELECT * FROM requests WHERE id= $1 AND userId = $2',
      values: [requestId, req.decoded.id],
    };

    const update = {
      text: 'UPDATE requests SET title = $1, category = $2, description = $3, urgencyLevel = $4 WHERE id = $5 AND userId = $6',
      values: [title, category, description, urgencyLevel, requestId, req.decoded.id]
    };

    db.query(existingRequest)
      .then((result) => {
        if (result.rows.length === 0) {
          return res.status(401).send({
            message: 'You are not Authorised to Modify this request!'
          });
        }

        db.query(update)
          .then((updated) => {
            if (title) {
              updateFields.title = title;
            }
            if (category) {
              updateFields.category = category;
            }
            if (description) {
              updateFields.description = description;
            }
            if (urgencyLevel) {
              updateFields.urgencyLevel = urgencyLevel;
            }
            return res.status(200).send({
              data: updated.rows[0],
              message: 'Request updated sucessfully'
            });
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
   *@description - Get all requests
   *@param {object} req - request object
   *
   * @param {object} res - responce object
   *
   * @return {object} return object as response
   *
   * @memberof Request
     */
  static getAll(req, res) {
    const fetchAll = {
      text: 'SELECT * FROM requests WHERE userId = $1',
      values: [req.decoded.id],
    };
    db.query(fetchAll)
      .then((result) => {
        if (result.rows.length > 0) {
          return res.status(200).send({
            requests: result.rows,
            message: 'Requests successfully retrieved from the database'
          });
        }
        return res.status(200).send({
          message: 'No request for this user',
          status: 'success',
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
   *@description - Get a the request of a logged in user
   *@param {object} req - request object
   *
   * @param {object} res - responce object
   *
   * @return {object} return object as response
   *
   * @memberof Request
     */
  static getOne(req, res) {
    const { requestId } = req.params;
    if (requestId === false) {
      return res.status(400).send({
        message: 'Invalid Id, please provide a valid Id'
      });
    }
    const fetchOne = {
      text: 'SELECT * FROM requests WHERE id = $1 AND userId = $2',
      values: [requestId, req.decoded.id],
    };
    db.query(fetchOne)
      .then((result) => {
        if (result.rows[0]) {
          return res.status(200).send({
            Request: result.rows[0],
            message: 'Request successfully retrieved from the database'
          });
        }
        return res.status(401).json({
          message: 'You are not Authorised to view this request!'
        });
      })
      .catch((err) => {
        res.status(500).send({
          message: 'Some error occured!',
          error: err.message
        });
      });
  }
}
export default Request;
