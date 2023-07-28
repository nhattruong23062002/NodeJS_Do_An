const express = require('express');
const router = express.Router();

const { validateSchema } = require('../../../utils');
const {
  getProductSchema,
  createProductSchema,
} = require('./validations');
const {
  getProductAll,
  // getProductList, // thêm bộ lọc và tìm kiếm
  getProductDetail,
  updateProduct
} = require('./controller');

router.route('/').get(getProductAll)

router.route('/:id')
  .get(validateSchema(getProductSchema), getProductDetail)
  .patch(updateProduct)


module.exports = router;
