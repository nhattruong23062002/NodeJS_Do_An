const express = require('express');
const router = express.Router();

const { validateSchema } = require('../../../utils');
const {
  getDetailSchema,
  removeSchema,
  createSchema,
} = require('./validations');
const {
  getDetail,
  create,
  remove,
} = require('./controller');

router.route('/')
  .post(validateSchema(createSchema), create)
  .delete(validateSchema(removeSchema), remove)

router.route('/:id')
  .get(validateSchema(getDetailSchema), getDetail)

module.exports = router;
