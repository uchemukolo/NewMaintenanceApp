import bodyParser from 'body-parser';
import express from 'express';
import logger from 'morgan';
import request from './routes/requestRoute';
import user from './routes/userRoute';
import admin from './routes/adminRoute';


const app = express();
const port = parseInt(process.env.PORT, 10) || 9000;

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/v1/auth', user);
app.use('/api/v1/users/requests', request);
app.use('/api/v1/requests', admin);

app.get('*', (req, res) => res.status(200).json({
  message: 'Welcome To Maintenance Tracker API!!!',
}));

app.listen(port, () =>
  console.log(`server is up and running on localhost: ${port}`));


export default app;
