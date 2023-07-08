const express = require('express');
const router = express.Router();

const { Employee } = require('../../../models');

// GET ALL
router.get('/', async (req, res, next) => {
  try {
    let results = await Employee.find();

    return res.send({ code: 200, payload: results });
  } catch (err) {
    return res.status(500).json({ code: 500, error: err });
  }
});

// GET DETAIL
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    let found = await Employee.findById(id);
    // let found = await Employee.find({ _id: id });

    if (found) {
      return res.send({ code: 200, payload: found });
    }

    return res.status(410).send({ code: 404, message: 'Không tìm thấy' });
  } catch (err) {
    return res.status(500).json({ code: 500, error: err });
  }
});

// POST
router.post('/', async function (req, res, next) {
  try {
    const data = req.body;

    const newItem = new Employee(data);

    let result = await newItem.save();

    return res.send({ code: 200, message: 'Tạo thành công', payload: result });
  } catch (err) {
    console.log('««««« err »»»»»', err);
    return res.status(500).json({ code: 500, error: err });
  }
});

// DELETE
router.delete('/:id', async function (req, res, next) {
  try {
    const { id } = req.params;

    let found = await Employee.findByIdAndDelete(id);

    if (found) {
      return res.send({ code: 200, payload: found, message: 'Xóa thành công' });
    }

    return res.status(410).send({ code: 404, message: 'Không tìm thấy' });
  } catch (err) {
    return res.status(500).json({ code: 500, error: err });
  }
});

// UPDATE
router.patch('/:id', async function (req, res, next) {
  try {
    const { id } = req.params;

    const updateData = req.body;

    const found = await Employee.findByIdAndUpdate(id, updateData, { new: true });

    if (found) {
    return res.send({ code: 200, message: 'Cập nhật thành công', payload: found });
    }

    return res.status(410).send({ code  : 400, message: 'Không tìm thấy' });

  } catch (error) {
    return res.status(500).json({ code: 500, error: err });
  }
});

module.exports = router;
