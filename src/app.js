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

//init db
require('./dbs/init.mongodb');
// const { checkOverload } = require('./helpers/check.connect');
// checkOverload();

//init routes
const router = require('./routes');
app.use(router);

//handle error

module.exports = app;