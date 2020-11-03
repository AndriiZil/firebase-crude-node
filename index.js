const express = require('express');
const compression = require('compression');
const logger = require('morgan');

const usersRoute = require('./src/users/users.router');

const { error } = require('dotenv').config();

if (error) {
    throw new Error(error);
}

const app = express();

app.use(compression());
app.use(express.json());
app.use(logger('dev'));

app.use('/users', usersRoute);

app.use((err, req, res, next) => {
   if (err) {
       const code = err.code || err.status || 500;
       const message = err.message || 'Unknown Error';

       return res.status(code).send({ message });
   }
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
