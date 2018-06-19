import jwt from 'jsonwebtoken';
// import requests from '../models/dummyData';
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
  *@static - Create a new request
   *
   *@param {object} req - request object
   *
   * @param {object} res - responce object
   *
   * @return {object} return object as response
   *
   * @memberof Request
   */
  createRequest(req, res) {
    const {
      title, category, description, urgencyLevel
    } = req.body;
    const decoded = jwt.verify(req.headers.token);
    const findOne = {
      text: 'SELECT * FROM requests WHERE title = $1 AND userId = $2',
      values: [title, req.decode.id],
    };
    const create = {
      text: 'INSERT INTO requests(title, category, description, urgencyLevel, userId) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      values: [title, category, description, urgencyLevel, req.decode.id],
    };

    db.query(findOne)
      .then((result) => {
        if (result.rows[0]) {
          return res.status(409).json({
            message: 'Request Already Logged, Please Create a New Request'
          });
        }
        db.query(create)
          .then((responce) => {
            const newRequest = {
              id: responce.rows[0].id,
              userId: req.decode.id,
              status: responce.rows[0].currentStatus,
              title,
              category,
              description,
              urgencyLevel
            };
            res.status(201).json({
              message: 'Request Created Successfully',
              request: newRequest,
            });
          });
      })
      .catch((err) => {
        res.status(500).json({
          message: 'Signup Failed'
        });
      });

  }

  //   /**
  // 	 *@description - Fetch all the requests of a logged in user
  //  	 *
  //    *@param {object} request - HTTP request
  //    *
  //    * @param {object} response
  //    *
  //    *
  //    * @memberof Request
  //    */
  //   static getAll(req, res) {
  //     return res.status(200).json({
  //       message: 'Successful',
  //       request: requests,
  //       error: false
  //     });
  //   }
  //   /**
  // 	 *@description - Get a the request of a logged in user
  //  	 *
  //    *@param {object} req - HTTP request
  //    *
  //    * @param {object} res
  //    *
  //    * @return {object} this - Class instance
  //    *
  //    * @memberof Request
  //    */
  //   getOne(req, res) {
  //     for (let i = 0; i < request.length; i++) {
  //       if (request[i].requestId === parseInt(req.params.requestId, 10)) {
  //         return res.json({
  //           message: 'Successful',
  //           request: requests[i],
  //           error: false
  //         });
  //       }
  //     }
  //     return res.status(404).json({
  //       message: 'Request not found!',
  //       error: true
  //     });

  //   }

  //   /**
  //    *@description - Modify details of a request
  //    *
  //    *@param {object} req - HTTP request
  //    *
  //    * @param {object} res
  //    *
  //    *
  //    * @memberof Request
  //    */
  //   modifyRequest(req, res) {

  //     for (let i = 0; i < request.length; i++) {
  //       console.log(request[i].requestId);
  //       if (request[i].requestId === parseInt(req.params.requestId, 10)) {
  //         request[i].title = req.body.title;
  //         request[i].category = req.body.category;
  //         request[i].description = req.body.description;
  //         request[i].urgencyLevel = req.body.urgencyLevel;
  //         return res.json({
  //           message: 'Update Successful',
  //           request: request[i],
  //           error: false
  //         });
  //       }
  //     }
  //     return res.status(400).json({
  //       message: 'Not Successfull!',
  //       error: true
  //     });
}
export default Request;
