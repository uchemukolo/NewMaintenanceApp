import bodyParser from 'body-parser';
import express from 'express';
import logger from 'morgan';
import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';
import request from './routes/requestRoute';
import user from './routes/userRoute';
import admin from './routes/adminRoute';


const app = express();
// swagger definition
const swaggerDefinition = {
  info: {
    title: 'Maintenance Tracker API',
    version: '1.0.0',
    description: 'Maintenance Tracker App is an application that provides users with the ability to reach out to operations or repairs department regarding repair or maintenance requests and monitor the status of their request.',
  },
  host: 'localhost:9000',
  basePath: '/',
};

// options for the swagger docs
const options = {
  // import swaggerDefinitions
  swaggerDefinition,
  // path to the API docs
  apis: ['./server/doc.js'],
};

// initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

// serve swagger
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use(express.static('server/api'));

const port = parseInt(process.env.PORT, 10) || 9000;

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use('/api/v1/auth', user);
app.use('/api/v1/users/requests', request);
app.use('/api/v1/requests', admin);

// serve swagger
// app.get('*', (req, res) => {
//   res.sendfile(path.join(__dirname, 'index.html'));
// });

app.get('*', (req, res) => res.status(200).send({
  message: 'Welcome To Maintenance Tracker API!!!',
}));


app.listen(port, () =>
  console.log(`server is up and running on localhost: ${port}`));


export default app;
