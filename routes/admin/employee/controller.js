const JWT = require('jsonwebtoken');

const { Employee } = require('../../../models');
const { generateToken, generateRefreshToken } = require('../../../helpers/jwtHelper');
const jwtSettings = require('../../../constants/jwtSetting');
const { emit } = require('../../../models/Employee');
const { hashPassword } = require('../../../helpers/authHelper');

module.exports = {
  login: async (req, res, next) => {
    try {
      const { email } = req.body;

      const employee = await Employee.findOne({ email }).select('-password').lean();

      const token = generateToken(employee, jwtSettings.ADMIN_SECRET);
      const refreshToken = generateRefreshToken(employee._id, jwtSettings.ADMIN_SECRET);

      return res.status(200).json({
        token,
        refreshToken,
        user: employee,
      });
    } catch (err) {
      res.status(400).json({
        statusCode: 400,
        message: 'Looi',
      });
    }
  },

  forgotPassword: async (req,res,next) =>{
    try {
      const {email,question,newPassword} = req.body
      if (!email){
        res.status(400).send({ message: 'Email is required'})
      }
      if (!question){
        res.status(400).send({ message: 'question is required'})
      }
      if (!newPassword){
        res.status(400).send({ message: 'new password is required'})
      }
      //check
      const employee = await Employee.findOne({email,question})
      //validation
      if(!employee){
        return res.status(404).send({
          success: false,
          message: 'Wrong Email or question',
        });
      }
      const hashed = await hashPassword(newPassword)
      await Employee.findByIdAndUpdate(employee._id,{password:hashed})
      res.status(200).send(
        {
          success: true,
          message: 'Password Reset Successfully',
        }
      );
    } catch (error) {
      console.log(error)
      res.status(500).send({
        success: false,
        message: 'somthing went wrong',
        error
      })
    }
  },

  checkRefreshToken: async (req, res, next) => {
    try {
      const { refreshToken } = req.body;

      JWT.verify(refreshToken, jwtSettings.ADMIN_SECRET, async (err, decoded) => {
        if (err) {
          return res.status(401).json({
            message: 'refreshToken is invalid',
          });
        } else {
          console.log('««««« decoded »»»»»', decoded);
          const { id } = decoded;

          const employee = await Employee.findById(id).select('-password').lean();

          if (employee && employee.isActive) {
            const token = generateToken(employee, jwtSettings.ADMIN_SECRET);
            
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
      const token = generateToken(employee, jwtSettings.ADMIN_SECRET);
      const refreshToken = generateRefreshToken(employee._id, jwtSettings.ADMIN_SECRET);

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
       // Thêm header Cache-Control vào phản hồi
       res.set('Cache-Control', 'no-cache, no-store, must-revalidate');

      // Thêm header Cache-Control vào phản hồi
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate');

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
        return res.send({ code: 200, success: true, payload: found, message: 'Xóa thành công' });
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
          success: true,
          message: 'Cập nhật thành công',
          payload: found,
        });
      }

      return res.status(404).send({ code: 404, message: 'Không tìm thấy' });
    } catch (error) {
      return res.status(500).json({ code: 500, error: error });
    }
  },
 updateProfileController:async function (req,res) {
    try {
      const {firstName,lastName,email,password,address,phoneNumber} = req.body;
      const employee = await Employee.findById(req.params._id)
      //password
      if(password && password.length <6){
        return res.json({error: 'Password is required and 6 character long'})
      };
      const hashedPassword = password ? await hashPassword(password) : undefined;
      const updatedUser = await Employee.findByIdAndUpdate(req.user._id,{
        firstName: firstName || employee.firstName,
        lastName: lastName || employee.lastName,
        password: hashedPassword || employee.password,
        phoneNumber: phoneNumber || employee.phone,
        address: address || employee.address,
      },{new:true});
      res.status(200).send(
        {
          success: true,
          message: 'Profile updated successfuly',
          updatedUser,
        }
      );
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: 'Error while update profile',
        error
      })
    }
  },
  updateIsDelete: async function (req, res, next) {
    const { selectedIds } = req.body; // Lấy danh sách các ID từ yêu cầu

      try {
        // Thực hiện cập nhật cho từng ID trong danh sách
        const result = await Employee.updateMany(
          { _id: { $in: selectedIds } }, // Tìm các nhân viên có ID trong danh sách
          { $set: { isDelete: true } } // Cập nhật trường isDelete thành true
        );

        res.status(200).json({ message: 'Cập nhật thành công',success: true, payload: result });
      } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi trong quá trình cập nhật' });
   }},
};
