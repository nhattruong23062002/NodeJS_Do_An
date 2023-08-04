const express = require('express');
const router = express.Router();

const { validateSchema } = require('../../../utils');
const {
  getDetailSchema,
  createSchema,
} = require('./validations');
const {
  getAll,
  getDetail,
  create,
  remove,
  update,
  payment
} = require('./controller');

router.route('/payment').get(payment)

router.route('/')
  .get(getAll)
  .post(validateSchema(createSchema), create)

router.route('/:id')
  .get(validateSchema(getDetailSchema), getDetail)
  .patch(update)
  .delete(validateSchema(getDetailSchema), remove)

module.exports = router;
