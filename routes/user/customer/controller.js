
const { Customer } = require('../../../models');
const jwtSettings = require('../../../constants/jwtSetting');
const {generateToken,generateRefreshToken} = require('../../../helpers/jwtHelper');
const JWT = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require("bcryptjs");

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nhattr2306@gmail.com', // Thay thế bằng email của bạn để gửi yêu cầu đặt lại mật khẩu
    pass: 'mkjtvaunyizktgtp', // Thay thế bằng mật khẩu email của bạn
  },
});

module.exports = {

  changePassword: async (req, res, next) => {
    try {
      const { token } = req.params;
      const { currentPassword, newPassword } = req.body;

      // Giải mã token để lấy email của người dùng
      const decodedToken = JWT.verify(token, jwtSettings.USER_SECRET);
      const email = decodedToken.email;

      // Tìm kiếm người dùng dựa vào email
      const customer = await Customer.findOne({ email }).maxTimeMS(200000);
      console.log('««««« customer »»»»»', customer);

      if (!customer) {
        return res.status(404).json({
          statusCode: 404,
          message: "Không tìm thấy người dùng với email đã cung cấp.",
        });
      }

      // Kiểm tra mật khẩu hiện tại của người dùng
      const isMatch = await bcrypt.compare(currentPassword, customer.password);
      if (!isMatch) {
        return res.status(401).json({
          statusCode: 401,
          message: "Mật khẩu hiện tại không đúng.",
        });
      }
      
       // Cập nhật mật khẩu mới cho người dùng
      customer.password = newPassword;
      await customer.save();

      return res.status(200).json({
        statusCode: 200,
        message: "Mật khẩu đã được thay đổi thành công.",
      });
    } catch (err) {
      console.log("Error:", err);
      res.status(500).json({
        statusCode: 500,
        message: "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
      });
    }
  },

  resetPassword : async (req, res,next) => {
    try {
      const { token } = req.params;
      const { password } = req.body;
  
      // Giải mã token để lấy email của người dùng
      const decodedToken = JWT.verify(token, jwtSettings.USER_SECRET);
      const email = decodedToken.email;

  
      // Tìm kiếm người dùng dựa vào email
      const customer = await Customer.findOne({ email }).maxTimeMS(200000);
      console.log('««««« customer »»»»»', customer);
  
      if (!customer) {
        return res.status(404).json({
          statusCode: 404,
          message: "Không tìm thấy người dùng với email đã cung cấp.",
        });
      }
  
      // Cập nhật mật khẩu mới cho người dùng
      customer.password = password;
      await customer.save();
  
      return res.status(200).json({
        statusCode: 200,
        message: "Mật khẩu đã được đặt lại thành công.",
      });
    } catch (err) {
      console.log("Error:", err);
      res.status(500).json({
        statusCode: 500,
        message: "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
      });
    }
  },

  forgotPassword : async (req, res, next) => {
    try {
      const { email } = req.body;
  
      // Tìm kiếm nhân viên dựa vào email
      const customer = await Customer.findOne({ email }).select('-password').lean();

  
      if (!customer) {
        return res.status(404).json({
          statusCode: 404,
          message: 'Không tìm thấy người dùng với email đã cung cấp.',
        });
      }
  
      // Tạo mã token duy nhất
      const token = generateToken({ email: customer.email }, jwtSettings.USER_SECRET, { expiresIn: '15m' });

      console.log('««««« token »»»»»', token);
  
      // Gửi email chứa URL đặt lại mật khẩu
      const mailOptions = {
        from: 'nhattr2306@gmail.com', // Thay thế bằng email của bạn
        to: customer.email,
        subject: 'Yêu cầu đặt lại mật khẩu',
        html: `
          <p>Xin chào,</p>
          <p>Bạn đã yêu cầu đặt lại mật khẩu từ mỹ phẩm Elysian.Vui lòng nhấp vào liên kết bên dưới để đặt lại mật khẩu của bạn:</p>
          <p><a href="http://localhost:3000/resetPassword?token=${token}">Đặt lại mật khẩu</a></p>
          <p>Trân trọng,</p>
          <p>Đội ngũ của chúng tôi</p>
        `,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Error sending email:', error);
          return res.status(500).json({
            statusCode: 500,
            message: 'Đã có lỗi xảy ra khi gửi email. Vui lòng thử lại sau.',
          });
        }
        console.log('Email sent: ' + info.response);
        return res.status(200).json({
          statusCode: 200,
          message: 'Một email chứa liên kết đặt lại mật khẩu đã được gửi đến địa chỉ email của bạn.',
        });
      });
    } catch (err) {
      console.log('Error:', err);
      res.status(500).json({
        statusCode: 500,
        message: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.',
      });
    }
  },


  login: async (req, res, next) => {
    try {
      const { email } = req.body;

      const customer = await Customer.findOne({ email }).select('-password').lean();

      const token = generateToken(customer, jwtSettings.USER_SECRET);
      
      const refreshToken = generateRefreshToken(customer._id, jwtSettings.USER_SECRET);

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

          const customer = await Customer.findById(id).select('-password').lean();

          if (customer && customer.isActive) {
            const token = generateToken(customer, jwtSettings.USER_SECRET);
            
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
      let results = await Customer.find()
  
      return res.send({ code: 200, payload: results });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },
  
  getDetail: async (req, res, next) => {
    try {
      const { id } = req.params;
  
      let found = await Customer.findById(id)
  
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

      const { email, phoneNumber } = data;

      const getEmailExits = Customer.find({ email });
      const getPhoneExits = Customer.find({ phoneNumber });

      const [foundEmail, foundPhoneNumber] = await Promise.all([getEmailExits, getPhoneExits]);

      const errors = [];
      if (foundEmail && foundEmail.length > 0) errors.push('Email đã tồn tại');
      // if (!isEmpty(foundEmail)) errors.push('Email đã tồn tại');
      if (foundPhoneNumber && foundPhoneNumber.length > 0) errors.push('Số điện thoại đã tồn tại');

      if (errors.length > 0) {
        return res.status(404).json({
          code: 404,
          message: "Không thành công",
          errors,
        });
      }

      const newItem = new Customer(data);
  
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
  
      let found = await Customer.findByIdAndDelete(id);
  
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
      
     /*  const { email, phoneNumber, address } = updateData;

      const getEmailExits = Customer.find({ email });
      const getPhoneExits = Customer.find({ phoneNumber });
      const getAddressExits = Customer.find({ address });

      const [foundEmail, foundPhoneNumber, foundAddress] = await Promise.all([getEmailExits, getPhoneExits, getAddressExits]);

      if (foundEmail && foundEmail.length > 0) errors.push('Email đã tồn tại');
      if (foundPhoneNumber && foundPhoneNumber.length > 0) errors.push('Số điện thoại đã tồn tại');
      if (foundAddress && foundAddress.length > 0) errors.push('Địa chỉ đã tồn tại');

      if (errors.length > 0) {
        return res.status(404).json({
          code: 404,
          message: "Không thành công",
          errors,
        });
      } */
      const errors = [];

      const found = await Customer.findByIdAndUpdate(id, updateData, {
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
