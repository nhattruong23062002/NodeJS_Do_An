var express = require('express');
const router = express.Router();

const passport = require('passport');

const {
  passportConfigUser,
  passportConfigLocalUser,
} = require('../../middle-wares/passportUser');

passport.use('jwtUser', passportConfigUser);
passport.use('localUser', passportConfigLocalUser);

const categoriesRouter = require('./category/router');
const customersRouter = require('./customer/router');
const employeesRouter = require('./employee/router');
const ordersRouter = require('./order/router');
const productsRouter = require('./product/router');

router.use('/employees', employeesRouter);
router.use('/categories', categoriesRouter);
// router.use('/categories', passport.authenticate('jwtUser', { session: false }), categoriesRouter);
router.use('/customers', passport.authenticate('jwtUser', { session: false }), customersRouter);
// router.use('/products', passport.authenticate('jwtUser', { session: false }), productsRouter);
router.use('/products', productsRouter);
router.use('/orders', ordersRouter);

module.exports = router;
