import bodyParser from 'body-parser';
import express from 'express';
import logger from 'morgan';
import request from './routes/requestRoute';


const app = express();
const port = parseInt(process.env.PORT, 10) || 9000;

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/v1/users/requests', request);

app.get('*', (req, res) => res.status(200).json({
  message: 'Welcome To Maintenance Tracker API!!!',
}));

app.listen(port);

console.log(`server is up and running on localhost:  ${port}`);

export default app;