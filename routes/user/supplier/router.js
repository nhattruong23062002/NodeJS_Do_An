const express = require('express');
const router = express.Router();

const { validateSchema } = require('../../../utils');
const {
  getDetailSchema,
  createSchema,
} = require('./validations');
const {
  getAll,
} = require('./controller');

router.route('/')
  .get(getAll)
module.exports = router;
