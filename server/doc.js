/**
* @swagger
* definitions:
*   Signup:
*     type: object
*     properties:
*       firstname:
*         type: string
*       lastname:
*         type: string
*       email:
*         type: string
*         format: email
*       username:
*         type: string
*       password:
*         type: string
*         format: password
*     example:
*       firstname: firstname
*       lastname: firstname
*       email: example@example.com
*       username: username
*       role: role
*       password: password
*/

/**
* @swagger
* definitions:
*   Signin:
*     properties:
*       username:
*         type: string
*       password:
*         type: string
*         format: password
*     example:
*       username: example@example.com
*       password: password
*/

/**
* @swagger
* definitions:
*   Requests:
*     properties:
*       title:
*         type: string
*       description:
*         type: text
*       category:
*         type: enum
*       urgencyLevel:
*         type: enum
*       currentStatus:
*         type: enum
*     example:
*       title: Laptop Issues
*       description: Some text describing the problem
*       category: Repair
*       urgencyLevel: High
*       currentStatus: Pending
*/
/**
* @swagger
* /api/v1/auth/signup:
*   post:
*     tags:
*       - Users
*     description: Creates a new user
*     produces:
*       - application/json
*     parameters:
*       - name: Registration
*         description: Enter your details as shown in the example to the right
*         in: body
*         required: true
*         schema:
*           $ref: '#/definitions/Signup'
*     responses:
*       201:
*         description: Signup Successful
*/

/**
* @swagger
* /api/v1/auth/login:
*   post:
*     tags:
*       - Users
*     description: Sign in a registered user
*     produces:
*       - application/json
*     parameters:
*       - name: Login
*         description: Click on the example to the right and fill in your details
*         in: body
*         required: true
*         schema:
*           $ref: '#/definitions/Signin'
*     responses:
*       200:
*         description: Signin Successful
*/

/**
* @swagger
*   securityDefinations:
*     ApiKeyAuth:
*       type: apiKey
*       in: header
*       name: authorization
* /api/v1/users/requests:
*   post:
*     tags:
*       - Recipes
*     description: Add a new Request
*     produces:
*       - application/json
*     security:
*       - ApiKeyAuth: []
*     parameters:
*       - name: Post Request
*         description: Click on the example to the right and fill in your details
*         in: body
*         required: true
*         type: string
*         schema:
*           $ref: '#/definitions/Requests'
*     responses:
*       201:
*         description: Request created Successfully
*/

/**
* @swagger
* /api/v1/users/requests:
*   get:
*     tags:
*       - Requests
*     description: Returns all requests of a User
*     produces:
*       - application/json
*     parameters:
*       - name: Reqests
*         description: Click on the example to the right and fill in your details
*         in: body
*         required: true
*         schema:
*           $ref: '#/definitions/Requests'
*     responses:
*       200:
*         description: Successful
*/

/**
* @swagger
* /api/v1/users/requests{id}:
*   get:
*     tags:
*       - Requests
*     description: get one request of a User
*     produces:
*       - application/json
*     parameters:
*       - name: Reqests
*         description: Click on the example to the right and fill in your details
*         in: body
*         required: true
*         schema:
*           $ref: '#/definitions/Requests'
*     responses:
*       200:
*         description: Successful
*/

/**
* @swagger
* /api/v1/users/requests{id}:
*   put:
*     tags:
*       - Requests
*     description: Modify request of a User
*     produces:
*       - application/json
*     parameters:
*       - name: Reqests
*         description: Click on the example to the right and fill in your details
*         in: body
*         required: true
*         schema:
*           $ref: '#/definitions/Requests'
*     responses:
*       200:
*         description: Successful
*/

/**
* @swagger
* /api/v1/requests:
*   put:
*     tags:
*       - Requests
*     description: Fetch All requests in the application
*     produces:
*       - application/json
*     parameters:
*       - name: Reqests
*         description: Click on the example to the right and fill in your details
*         in: body
*         required: true
*         schema:
*           $ref: '#/definitions/Requests'
*     responses:
*       200:
*         description: Successful
*/

/**
* @swagger
* /api/v1/requests/approve:
*   put:
*     tags:
*       - Requests
*     description: approve user request
*     produces:
*       - application/json
*     parameters:
*       - name: Reqests
*         description: Click on the example to the right and fill in your details
*         in: body
*         required: true
*         schema:
*           $ref: '#/definitions/Requests'
*     responses:
*       200:
*         description: Successful
*/

/**
* @swagger
* /api/v1/requests/disapprove:
*   put:
*     tags:
*       - Requests
*     description: disapprove user request
*     produces:
*       - application/json
*     parameters:
*       - name: Reqests
*         description: Click on the example to the right and fill in your details
*         in: body
*         required: true
*         schema:
*           $ref: '#/definitions/Requests'
*     responses:
*       200:
*         description: Successful
*/

/**
* @swagger
* /api/v1/requests/resolve:
*   put:
*     tags:
*       - Requests
*     description: resolve user request
*     produces:
*       - application/json
*     parameters:
*       - name: Reqests
*         description: Click on the example to the right and fill in your details
*         in: body
*         required: true
*         schema:
*           $ref: '#/definitions/Requests'
*     responses:
*       200:
*         description: Successful
*/
