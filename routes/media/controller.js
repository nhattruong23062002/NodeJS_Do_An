
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Customer } = require('../../models');


// MULTER UPLOAD
const upload = require('../../middle-wares/fileMulter');

const {
  updateDocument,
  findDocument,
  insertDocument,
  insertDocuments,
} = require('../../helpers/MongoDbHelper');

async function updateCustomerAvatarUrl(customerId, imageUrl) {
  try {
    const customer = await Customer.findByIdAndUpdate(
      customerId,
      { avatarUrl: imageUrl }, // Cập nhật đường dẫn mới vào trường avatarUrl
      { new: true } // Tùy chọn này để trả về thông tin sau khi cập nhật
    );

    // Trả về thông tin khách hàng sau khi cập nhật
    return customer;
  } catch (error) {
    // Xử lý lỗi nếu cần thiết
    throw error;
  }
}
module.exports = {

  
  uploadSingle: async (req, res, next) => upload.single('file')(req, res, async (err) => {
    try {
      if (err instanceof multer.MulterError) {
        res.status(500).json({ type: 'MulterError', err: err });
      } else if (err) {
        res.status(500).json({ type: 'UnknownError', err: err });
      } else {
        console.log('««««« file »»»»»', req.file);

        const name = req.file.filename;
        const customerId = req.user._id;

        console.log('««««« req.user »»»»»', req.user);
        const imageUrl = `uploads/media/file/${name}`;

        await updateCustomerAvatarUrl(customerId, imageUrl);

        const response = await insertDocument(
          { location: imageUrl, name, customerId },
          'Media',
        );
        res.status(200).json({
          message: 'Tải lên thành công',
          payload: response.result,
        });
      }
    } catch (error) {
      console.log('««««« error »»»»»', error);
      console.log('««««« co chay vo day ma ko hieu sao loi »»»»»');

      res.status(500).json({ ok: false, error });
    }
  }),

  uploadMultiple: async (req, res, next) => upload.array('files', 3)(req, res, async (err) => {
    try {
      if (err instanceof multer.MulterError) {
        res.status(500).json({ type: 'MulterError', err: err });
      } else if (err) {
        res.status(500).json({ type: 'UnknownError', err: err });
      } else {
        const files = req.files;
        const employeeId = req.user._id;

        const dataInsert = files.reduce((prev, nextP) => {
          prev.push({
            name: nextP.filename,
            location: nextP.path,
            employeeId,
          });
          return prev;
        }, []);

        const response = await insertDocuments(dataInsert, 'Media');

        res.status(200).json({
          message: "Tải lên nhiều file được rồi đó",
          payload: response,
        });
      }
    } catch (error) {
      res.status(500).json({ message: "Có lỗi sảy ra", error });
    }
  }),

  updateSingle: async function (req, res, next) {
    const { id } = req.params;

    const found = await findDocument(id, 'Media');

    const found1 = await Media.findById(id)

    console.log('««««« found »»»»»', found);
    console.log('««««« found1 »»»»»', found1);

    if (!found) res.status(410).json({ message: `Media with id ${id} not found` });

    upload.single('file')(req, res, async (err) => {
      try {
        if (err instanceof multer.MulterError) {
          res.status(500).json({ type: 'MulterError', err: err });
        } else if (err) {
          res.status(500).json({ type: 'UnknownError', err: err });
        } else {
          const imageUrl = `/uploads/media/${req.file.filename}`;
          const name = req.file.filename;
          const employeeId = req.user._id;

          // updateOne | findByIdAndUpdate
          const response = await updateDocument(
            { _id: id },
            {
              location: imageUrl,
              name,
              employeeId,
            },
            'Media',
          );

          res.status(200).json({ ok: true, payload: response });
        }
      } catch (error) {
        res.status(500).json({ ok: false, error });
      }
    });
  },
};
