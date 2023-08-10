const express = require('express');
const router = express.Router();

const { validateSchema } = require('../../utils');
const {
  q1,
  q3a,
} = require('./validations');
const {
  question1,
  question1a,
  question1b,
  question2a,
  question2b,
  question3,
  question3a,
  question3b,
  question3c,
  question4,
  question4a,
  question5,
  question6,
  question7,
  question7a,
  question8a,
  question8b,
  question13,
  question15,
  question18,
  question19,
  question20,
  question21,
  question22,
  question23,
  question24,
  question25,
  question26,
  question26b,
  question26c,
  question27,
  question29,
  question30,
  question33,
  question34,
  flashsale,
  bestseller,
  productlist,
  productSearch,
  productSimilar,
  filterCategory,
  totalstaff,
  grossproduct,
  totalorder,
  canceledorder,
  outstock,
  countNewEmployees,
  outstock1,
  bestsellerlist,
  totalsupplier,
  CompletedOrders,
  listorders,
  totalcustomer,
  grossprcate,
  getTop5Customers,
  countNewCustomer,
  calculateRevenueInAWeek,
  productSearchb,
  employeeSearch,
} = require('./controller');

router.get('/1', question1);
router.get('/1a', validateSchema(q1), question1a);
router.get('/1b', question1b);
router.get('/2a', question2a);
router.get('/2b', question2b);
router.get('/3', question3);
router.get('/3a', validateSchema(q3a), question3a);
router.get('/3b', question3b);
router.get('/3c', question3c);
router.get('/4', question4);
router.get('/4a', question4a);
router.get('/5', question5);
router.get('/6', question6);
router.get('/7', question7);
router.get('/7a', question7a);
router.get('/8a', question8a);
router.get('/8b', question8b);
router.get('/13', question13);
router.get('/15', question15);
router.get('/18', question18);
router.get('/19', question19);
router.get('/20', question20);
router.get('/21', question21);
router.get('/22', question22);
router.get('/23', question23);
router.get('/24', question24);
router.get('/25', question25);
router.get('/26', question26);
router.get('/26b', question26b);
router.get('/26c', question26c);
router.get('/27', question27);
router.get('/29', question29);
router.get('/30', question30);
router.get('/33', question33);
router.get('/34', question34);
router.get('/flashsale', flashsale);
router.get('/bestseller', bestseller);
router.get('/productlist', productlist);
router.get('/productSearch', productSearch);
router.get('/productSimilar', productSimilar);
router.get('/filterCategory', filterCategory);
router.get('/totalstaff', totalstaff);
router.get('/grossproduct', grossproduct);
router.get('/totalorder', totalorder);
router.get('/canceledorder', canceledorder);
router.get('/outstock', outstock);
router.get('/countNewEmployees', countNewEmployees);
router.get('/outstock1', outstock1);
router.get('/bestsellerlist', bestsellerlist);
router.get('/totalsupplier', totalsupplier);
router.get('/CompletedOrders', CompletedOrders);
router.get('/listorders', listorders);
router.get('/totalcustomer', totalcustomer);
router.get('/grossprcate', grossprcate);
router.get('/getTop5Customers', getTop5Customers);
router.get('/countNewCustomer', countNewCustomer);
router.get('/calculateRevenueInAWeek', calculateRevenueInAWeek);
router.get('/productSearchb', productSearchb);
router.get('/employeeSearch', employeeSearch);

module.exports = router;
