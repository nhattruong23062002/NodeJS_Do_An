const express = require("express");
const passport = require("passport");
const router = express.Router();

const { validateSchema } = require("../../../utils");
const { loginSchema, getDetailSchema, createSchema } = require("./validations");
const {
  login,
  checkRefreshToken,
  getMe,
  getAll,
  getDetail,
  create,
  remove,
  update,
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


router
  .route("/profile") // Đối tượng cần kiểm tra là token có hợp lệ hay không
  .get(passport.authenticate("jwtAdmin", { session: false }), getMe);

router.route("/").get(getAll).post(validateSchema(createSchema), create);

router
  .route("/:id")
  .get(validateSchema(getDetailSchema), getDetail)
  .patch(validateSchema(createSchema), update)
  .delete(validateSchema(getDetailSchema), remove);

module.exports = router;
