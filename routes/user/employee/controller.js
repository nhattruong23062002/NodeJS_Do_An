const JWT = require('jsonwebtoken');

const { Employee } = require('../../../models');
const { generateToken, generateRefreshToken } = require('../../../helpers/jwtHelper');
const jwtSettings = require('../../../constants/jwtSetting');

module.exports = {
  login: async (req, res, next) => {
    try {
      const { email } = req.body;

      const employee = await Employee.findOne({ email }).select('-password').lean();

      const token = generateToken(employee, jwtSettings.USER_SECRET);
      const refreshToken = generateRefreshToken(employee._id, jwtSettings.USER_SECRET);

      return res.status(200).json({
        token,
        refreshToken,
      });
    } catch (err) {
      res.status(400).json({
        statusCode: 400,
        message: 'Looi',
      });
    }
  },

  checkRefreshToken: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;

      JWT.verify(refreshToken, jwtSettings.USER_SECRET, async (err, decoded) => {
        if (err) {
          return res.status(401).json({
            message: 'refreshToken is invalid',
          });
        } else {
          console.log('««««« decoded »»»»»', decoded);
          const { id } = decoded;

          const employee = await Employee.findById(id).select('-password').lean();

          if (employee && employee.isActive) {
            const token = generateToken(employee, jwtSettings.USER_SECRET);
            
            return res.status(200).json({ token });
          }
          return res.sendStatus(401);
        }
      });
    } catch (err) {
      res.status(400).json({
        statusCode: 400,
        message: 'Lỗi',
      });
    }
  },

  basic: async (req, res, next) => {
    try {
      const employee = await Employee.findById(req.user._id).select('-password').lean();
      const token = generateToken(employee, jwtSettings.USER_SECRET);
      const refreshToken = generateRefreshToken(employee._id, jwtSettings.USER_SECRET);

      res.json({
        token,
        refreshToken,
      });
    } catch (err) {
      res.sendStatus(400);
    }
  },

  getMe: async (req, res, next) => {
    try {
      res.status(200).json({
        payload: req.user,
      });
    } catch (err) {
      res.sendStatus(500);
    }
  },

  getAll: async (req, res, next) => {
    try {
      let results = await Employee.find()

      return res.send({ code: 200, payload: results });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  getDetail: async (req, res, next) => {
    try {
      const { id } = req.params;

      let found = await Employee.findById(id)

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
  },

  create: async function (req, res, next) {
    try {
      const data = req.body;

      const { email, phoneNumber, address } = data;

      const getEmailExits = Employee.find({ email });
      const getPhoneExits = Employee.find({ phoneNumber });
      const getAddressExits = Employee.find({ address });

      const [foundEmail, foundPhoneNumber, foundAddress] = await Promise.all([getEmailExits, getPhoneExits, getAddressExits]);

      const errors = [];
      if (foundEmail && foundEmail.length > 0) errors.push('Email đã tồn tại');
      // if (!isEmpty(foundEmail)) errors.push('Email đã tồn tại');
      if (foundPhoneNumber && foundPhoneNumber.length > 0) errors.push('Số điện thoại đã tồn tại');
      if (foundAddress && foundAddress.length > 0) errors.push('Địa chỉ đã tồn tại');

      if (errors.length > 0) {
        return res.status(404).json({
          code: 404,
          message: "Không thành công",
          errors,
        });
      }

      console.log('««««« data »»»»»', data);

      const newItem = new Employee(data);

      console.log('««««« newItem »»»»»', newItem);

      let result = await newItem.save();

      return res.send({ code: 200, message: 'Tạo thành công', payload: result });
    } catch (err) {
      console.log('««««« err »»»»»', err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  remove: async function (req, res, next) {
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
  },

  update: async function (req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const { email, phoneNumber, address } = updateData;

      const getEmailExits = Employee.find({ email });
      const getPhoneExits = Employee.find({ phoneNumber });
      const getAddressExits = Employee.find({ address });

      const [foundEmail, foundPhoneNumber, foundAddress] = await Promise.all([getEmailExits, getPhoneExits, getAddressExits]);

      const errors = [];
      if (foundEmail && foundEmail.length > 0) errors.push('Email đã tồn tại');
      // if (!isEmpty(foundEmail)) errors.push('Email đã tồn tại');
      if (foundPhoneNumber && foundPhoneNumber.length > 0) errors.push('Số điện thoại đã tồn tại');
      if (foundAddress && foundAddress.length > 0) errors.push('Địa chỉ đã tồn tại');

      if (errors.length > 0) {
        return res.status(404).json({
          code: 404,
          message: "Không thành công",
          errors,
        });
      }

      const found = await Employee.findByIdAndUpdate(id, updateData, {
        new: true,
      });

      if (found) {
        return res.send({
          code: 200,
          message: 'Cập nhật thành công',
          payload: found,
        });
      }

      return res.status(404).send({ code: 404, message: 'Không tìm thấy' });
    } catch (error) {
      return res.status(500).json({ code: 500, error: err });
    }
  },
};
