const express = require('express');
const router = express.Router();

const { validateSchema } = require('../../../utils');
const {
  getProductSchema,
  createProductSchema,
} = require('./validations');
const {
  getProductAll,
  getProductDetail,
  createProduct,
  deleteProduct,
  updateProduct,
  updateIsDelete,
} = require('./controller');

router.route('/')
  .get(getProductAll)
  .post(validateSchema(createProductSchema), createProduct)

router.route('/:id')
  .get(validateSchema(getProductSchema), getProductDetail)
  .patch(validateSchema(createProductSchema), updateProduct)
  .delete(validateSchema(getProductSchema), deleteProduct)
router.route('/delete').post(updateIsDelete)
// GET ALL
// router.get('/', getProductAll);

// GET DETAIL
// router.get('/:id', validateSchema(getProductSchema), getProductDetail);

// POST
// router.post('/', validateSchema(createProductSchema), createProduct);

// DELETE
// router.delete('/:id', validateSchema(getProductSchema), deleteProduct);

// UPDATE
// router.patch('/:id', validateSchema(createProductSchema), updateProduct);

module.exports = router;
