const express = require("express");
const passport = require("passport");
const router = express.Router();

const { validateSchema } = require("../../../utils");
const { loginSchema, getDetailSchema, createSchema ,resetPasswordSchema,patchSchema} = require("./validations");
const {
  login,
  checkRefreshToken,
  getMe,
  getAll,
  getDetail,
  create,
  remove,
  update,
  forgotPassword,
  resetPassword,
  changePassword
} = require("./controller");

const {
  passportConfigUser,
  passportConfigLocalUser,
} = require("../../../middle-wares/passportUser");

passport.use(passportConfigUser);
passport.use(passportConfigLocalUser);

router
  .route("/login") // Đối tượng cần kiểm tra là tài khoản và mật khẩu gửi lên
  .post(
    validateSchema(loginSchema),
    passport.authenticate("localUser", { session: false }),
    login
  );

router.route("/refresh-token").post(checkRefreshToken);

router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword/:token").post(resetPassword);
router.route("/changePassword/:token").post(changePassword);




router
  .route("/profile") // Đối tượng cần kiểm tra là token có hợp lệ hay không
  .get(passport.authenticate("jwtUser", { session: false }), getMe);

router.route("/")
  .get(getAll)
  .post(validateSchema(createSchema), create);

router
  .route("/:id")
  .get(validateSchema(getDetailSchema), getDetail)
  .patch(validateSchema(patchSchema), update)
  .delete(validateSchema(getDetailSchema), remove);

module.exports = router;
