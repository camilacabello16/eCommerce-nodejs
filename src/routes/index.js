'use strict'

const express = require('express');
const { checkApiKey, checkPermission } = require('../auth/checkAuth');
const router = express.Router();

//check api key
router.use(checkApiKey);
//check permission
router.use(checkPermission('0000'));

router.use('/v1/api', require('./access'));
router.use('/v1/api', require('./product'));

module.exports = router;