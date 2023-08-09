const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const bcrypt = require('bcryptjs');

// Mongoose Datatypes:
// https://mongoosejs.com/docs/schematypes.html

// Validator
// https://mongoosejs.com/docs/validation.html#built-in-validators

const employeeSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Tên không được bỏ trống'],
      maxLength: [50, 'Tên không được vượt quá 50 ký tự'],
    },
    lastName: {
      type: String,
      required: [true, 'Họ không được bỏ trống'],
      maxLength: [50, 'Họ không được vượt quá 50 ký tự'],
    },
    phoneNumber: {
      type: String,
      maxLength: [50, 'Số điện thoại không được vượt quá 50 ký tự'],
      validate: {
        validator: function (value) {
          const phoneRegex = /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;
          return phoneRegex.test(value);
        },
        message: `{VALUE} is not a valid phone!`,
        // message: (props) => `{props.value} is not a valid email!`,
      },
    },
    address: {
      type: String,
      required: [true, 'Địa chỉ không được bỏ trống'],
      maxLength: [500, 'Địa chỉ không được vượt quá 500 ký tự'],
      unique: [true, 'Địa chỉ không được trùng'],
    },
    email: {
      type: String,
      validate: {
        validator: function (value) {
          const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
          return emailRegex.test(value);
        },
        message: `{VALUE} is not a valid email!`,
        // message: (props) => `{props.value} is not a valid email!`,
      },
      required: [true, 'Email không được bỏ trống'],
      maxLength: [50, 'Email không được vượt quá 50 ký tự'],
      unique: [true, 'Email không được trùng'],
    },
    birthday: { type: Date },
    password: {
      type: String,
      minLength: [6, 'Mật khẩu phải có tối thiểu 6 kí tự'],
      maxLength: [12, 'Mật khẩu không được vượt quá 12 ký tự'],
      required: [true, 'Mật khẩu không được bỏ trống'],
    },
    sex: {
      type: String,
      maxLength: [6, 'Mật khẩu không được vượt quá 6 ký tự'],
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },
    role: {
      type: Number,
      default: 0,
    },
    question: {
      type: String,
      required: true,
    },
    isDelete: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true, // Sẽ tự động tạo trường createdAt và updatedAt
    versionKey: false,
  },
);

// Virtuals
employeeSchema.virtual('fullName').get(function () {
  return this.firstName + ' ' + this.lastName;
});

employeeSchema.pre('save', async function (next) {
  try {
    // generate salt key
    const salt = await bcrypt.genSalt(10); // 10 ký tự ABCDEFGHIK + 123456
    // generate password = salt key + hash key
    const hashPass = await bcrypt.hash(this.password, salt);
    // override password
    this.password = hashPass;

    next();
  } catch (err) {
    next(err);
  }
});

employeeSchema.methods.isValidPass = async function(pass) {
  try {
    return await bcrypt.compare(pass, this.password);
  } catch (err) {
    throw new Error(err);
  }
};

// employeeSchema.pre('save', function a(next) {
//   const employee = this;

//   if (!employee.isModified('password')) return next();

//   bcrypt.genSalt(10, (err, salt) => {
//     if (err) return next(err);

//     bcrypt.hash(employee.password, salt, (hashErr, hash) => {
//       if (hashErr) return next(hashErr);

//       employee.password = hash;
//       next();
//     });
//   });
// });

const Employee = model('Employee', employeeSchema);
module.exports = Employee;
