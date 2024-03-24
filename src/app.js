//express
//morgan: log 
//helmet: anti hacker
//compression: optimize bang thong

require('dotenv').config();
const compression = require('compression');
const express = require('express');
const { default: helmet } = require('helmet');
const morgan = require('morgan');
const app = express();

//init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))

//init db
require('./dbs/init.mongodb');
// const { checkOverload } = require('./helpers/check.connect');
// checkOverload();

//init routes
const router = require('./routes');
app.use(router);

//handle error
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: error.message || 'Internal server error'
    })
});

module.exports = app;