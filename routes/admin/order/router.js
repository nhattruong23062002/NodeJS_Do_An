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
  updateIsDelete,
} = require('./controller');

router.route('/')
  .get(getAll)
  .post(validateSchema(createSchema), create)

router.route('/:id')
  .get(validateSchema(getDetailSchema), getDetail)
  .patch(validateSchema(createSchema), update)
  .delete(validateSchema(getDetailSchema), remove)
router.route('/delete').post(updateIsDelete) 
module.exports = router;
