const express = require('express');
const router = express.Router();
const yup = require('yup');
const ObjectId = require('mongodb').ObjectId;

const { Product } = require('../../../models');
const { validateSchema } = require('../../../utils');
const {
  getProductSchema,
  createProductSchema,
} = require('../../validation/product');

// GET ALL
router.get('/', async (req, res, next) => {
  try {
    let results = await Product.find()
      .populate('category')
      .populate('supplier');

    return res.send({ code: 200, payload: results });
  } catch (err) {
    return res.status(500).json({ code: 500, error: err });
  }
});

// GET DETAIL
router.get('/:id', validateSchema(getProductSchema), async (req, res, next) => {
  try {
    const { id } = req.params;

    let found = await Product.findById(id)
      .populate('category')
      .populate('supplier');

    if (found) {
      return res.send({ code: 200, payload: found });
    }

    return res.status(410).send({ code: 404, message: 'Không tìm thấy' });
  } catch (err) {
    res.status(404).json({
      message: 'Get detail fail!!',
      payload: err,
    });
  }
});

// POST
router.post('/', validateSchema(createProductSchema), async function (req, res, next) {
  try {
    const data = req.body;

    const newItem = new Product(data);

    let result = await newItem.save();

    return res.send({ code: 200, message: 'Tạo thành công', payload: result });
  } catch (err) {
    console.log('««««« err »»»»»', err);
    return res.status(500).json({ code: 500, error: err });
  }
});

// DELETE
router.delete('/:id', validateSchema(getProductSchema), async function (req, res, next) {
  try {
    const { id } = req.params;

    let found = await Product.findByIdAndDelete(id);

    if (found) {
      return res.send({ code: 200, payload: found, message: 'Xóa thành công' });
    }

    return res.status(410).send({ code: 404, message: 'Không tìm thấy' });
  } catch (err) {
    return res.status(500).json({ code: 500, error: err });
  }
});

// UPDATE
router.patch('/:id', validateSchema(createProductSchema), async function (req, res, next) {
  try {
    const { id } = req.params;

    const updateData = req.body;

    const found = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (found) {
      return res.send({
        code: 200,
        message: 'Cập nhật thành công',
        payload: found,
      });
    }

    return res.status(410).send({ code: 400, message: 'Không tìm thấy' });
  } catch (error) {
    return res.status(500).json({ code: 500, error: err });
  }
});

module.exports = router;
