const express = require('express');
const passport = require('passport');
const router = express.Router();

const { validateSchema } = require('../../../utils');
const {
  loginSchema,
  getDetailSchema,
  createSchema,
  editSchema,
} = require('./validations');
const {
  login,
  checkRefreshToken,
  basic,
  getMe,
  getAll,
  getDetail,
  create,
  remove,
  update,
  forgotPassword,
  updateProfileController,
  updateIsDelete,
} = require('./controller');
const allowRoles = require('../../../middle-wares/checkRole');

const {
  passportConfigAdmin,
  passportConfigLocalAdmin,
} = require('../../../middle-wares/passportAdmin');

passport.use(passportConfigAdmin);
passport.use(passportConfigLocalAdmin);

router.route('/login') // Đối tượng cần kiểm tra là tài khoản và mật khẩu gửi lên
  .post(
    validateSchema(loginSchema),
    passport.authenticate('localAdmin', { session: false }),
    login,
    )
router.route('/forgot-password')
  .post(forgotPassword)
router.route('/refresh-token')
  .post(checkRefreshToken)

router.route('/profile') // Đối tượng cần kiểm tra là token có hợp lệ hay không
  .get(passport.authenticate('jwtAdmin', { session: false }), getMe)
  .put(passport.authenticate('jwtAdmin', { session: false }), updateProfileController)

router.route('/')
  .get(
    passport.authenticate('jwtAdmin', { session: false }),
    // allowRoles('GET_ALL_EMPLOYEE'),
    getAll,
    )
  .post(validateSchema(createSchema), create)

router.route('/:id')
  .get(validateSchema(getDetailSchema), passport.authenticate('jwtAdmin', { session: false }), getDetail)
  .patch(validateSchema(editSchema), passport.authenticate('jwtAdmin', { session: false }), update)
  .delete(
    passport.authenticate('jwtAdmin', { session: false }), // CHECK TOKEN IS VALID
    allowRoles('DELETE_EMPLOYEE'), // CHECK USER HAS ROLE
    validateSchema(getDetailSchema), // CHECK PARAMS
    remove, // HANDLE DELETE
  )
  router.route('/delete').post(updateIsDelete) 

module.exports = router;
