const express = require('express');
const router = express.Router();

const {
  uploadSingle,
  uploadMultiple,
  updateSingle,
} = require('./controller');

router.route('/upload-single')
  .post(uploadSingle)

router.route('/upload-multiple')
  .post(uploadMultiple)

router.route('/update/:id')
  .post(updateSingle)

module.exports = router;
