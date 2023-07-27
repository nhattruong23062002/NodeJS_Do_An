const { getQueryDateTime } = require("../../utils");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const {
  Product,
  Category,
  Supplier,
  Customer,
  Order,
  Employee,
} = require("../../models");

module.exports = {
  question1: async (req, res, next) => {
    try {
      const conditionFind = {
        discount: { $lte: 10 },
      };

      console.log("««««« conditionFind »»»»»", conditionFind);

      let results = await Product.find(conditionFind);
      let total = await Product.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question1a: async (req, res, next) => {
    try {
      const { discount, type } = req.query;

      const conditionFind = {};

      if (discount) {
        switch (type) {
          case "eq":
            conditionFind.discount = { $eq: discount };
            break;

          case "lt":
            conditionFind.discount = { $lt: discount };
            break;

          case "lte":
            conditionFind.discount = { $lte: discount };
            break;

          case "gt":
            conditionFind.discount = { $gt: discount };
            break;

          case "gte":
            conditionFind.discount = { $gte: discount };
            break;

          default:
            conditionFind.discount = { $eq: discount };
            break;
        }
      }

      console.log("««««« conditionFind »»»»»", conditionFind);

      let results = await Product.find(conditionFind);
      let total = await Product.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question1b: async (req, res, next) => {
    try {
      const conditionFind = {
        discount: { $lte: 10 },
      };

      console.log("««««« conditionFind »»»»»", conditionFind);

      let results = await Product.find(conditionFind)
        .populate("supplier")
        .populate("category")
        .lean();

      let total = await Product.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question2a: async (req, res, next) => {
    try {
      const conditionFind = {
        stock: { $lte: 5 },
      };

      console.log("««««« conditionFind »»»»»", conditionFind);

      let results = await Product.find(conditionFind).lean();

      let total = await Product.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question2b: async (req, res, next) => {
    try {
      const conditionFind = {
        stock: { $lte: 5 },
      };

      console.log("««««« conditionFind »»»»»", conditionFind);

      let results = await Product.find(conditionFind)
        .populate("supplier")
        .populate("category")
        .lean();

      let total = await Product.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question3: async (req, res, next) => {
    try {
      // let discountedPrice = price * (100 - discount) / 100;
      const s = { $subtract: [100, "$discount"] }; // (100 - 10) s => 90

      const m = { $multiply: ["$price", s] }; // price * 90

      const d = { $divide: [m, 100] }; // price * 90 / 100

      const conditionFind = { $expr: { $lte: [d, parseFloat(40000)] } };

      console.log("««««« conditionFind »»»»»", conditionFind);

      let results = await Product.find(conditionFind)
        .select("-categoryId -supplierId -description")
        .lean(); // convert data to object

      // const newResults = results.map((item) => {
      //   const dis = item.price * (100 - item.discount) / 100;
      //   return {
      //     ...item,
      //     dis,
      //   }
      // }).filter((item) => item.dis >= 40000);

      // console.log('««««« newResults »»»»»', newResults);

      let total = await Product.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question3a: async (req, res, next) => {
    try {
      const s = { $subtract: [100, "$discount"] }; // (100 - 10) s => 90

      const m = { $multiply: ["$price", s] }; // price * 90

      const d = { $divide: [m, 100] }; // price * 90 / 100

      const { price } = req.query;

      const conditionFind = { $expr: { $lte: [d, parseFloat(price)] } };

      console.log("««««« conditionFind »»»»»", conditionFind);

      let results = await Product.find(conditionFind).lean(); // convert data to object

      let total = await Product.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question3b: async (req, res, next) => {
    try {
      const s = { $subtract: [100, "$discount"] }; // (100 - 10) s => 90
      const m = { $multiply: ["$price", s] }; // price * 90
      const d = { $divide: [m, 100] }; // price * 90 / 100

      // let results = await Product.aggregate([
      //   {
      //     $match: { $expr: { $lte: [d, parseFloat(40000)] } },
      //   },
      // ]);
      // aggregate([])

      let results = await Product.aggregate().match({
        $expr: { $lte: [d, parseFloat(40000)] },
      });

      let total = await Product.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question3c: async (req, res, next) => {
    try {
      const s = { $subtract: [100, "$discount"] }; // (100 - 10) s => 90
      const m = { $multiply: ["$price", s] }; // price * 90
      const d = { $divide: [m, 100] }; // price * 90 / 100

      // let results = await Product.aggregate([
      //   { $addFields: { disPrice: d } },
      //   {
      //     $match: { $expr: { $lte: ['$disPrice', parseFloat(40000)] } },
      //   },
      //   {
      //     $project: {
      //       categoryId: 0,
      //       supplierId: 0,
      //       description: 0,
      //     },
      //   },
      // ]);

      let results = await Product.aggregate()
        .addFields({ disPrice: d })
        .match({ $expr: { $lte: ["$disPrice", parseFloat(40000)] } })
        .project({
          categoryId: 0,
          supplierId: 0,
          description: 0,
        });

      let total = await Product.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question4: async (req, res, next) => {
    try {
      const { address } = req.query;

      const conditionFind = {
        address: { $regex: new RegExp(`${address}`), $options: "i" },
      };
      // const conditionFind = { address: new RegExp(`${address}`) };
      // const conditionFind = { address: {$eq: address } };

      console.log("««««« conditionFind »»»»»", conditionFind);

      let results = await Customer.find(conditionFind);

      let total = await Customer.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question4a: async (req, res, next) => {
    try {
      const { address } = req.query;

      // const conditionFind = { address: { $regex: new RegExp(`${address}`), $options: 'i' } };
      // const conditionFind = { address: new RegExp(`${address}`) };
      // const conditionFind = { address: {$eq: address } };

      let results = await Customer.aggregate().match({
        address: { $regex: new RegExp(`${address}`), $options: "i" },
      });

      let total = await Customer.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question5: async (req, res, next) => {
    try {
      const { year } = req.query;

      const conditionFind = {
        $expr: {
          $eq: [{ $year: "$birthday" }, year],
        },
      };

      console.log("««««« conditionFind »»»»»", conditionFind);

      let results = await Customer.find(conditionFind);

      let total = await Customer.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question6: async (req, res, next) => {
    try {
      const { date } = req.query;
      let today;

      if (!date) {
        today = new Date();
      } else {
        today = new Date(date);
      }

      const conditionFind = {
        $expr: {
          $and: [
            {
              $eq: [{ $dayOfMonth: "$birthday" }, { $dayOfMonth: today }],
            },
            { $eq: [{ $month: "$birthday" }, { $month: today }] },
          ],
        },
      };

      // const eqDay = {
      //   $eq: [{ $dayOfMonth: '$birthday' }, { $dayOfMonth: today }],
      // };
      // const eqMonth = { $eq: [{ $month: '$birthday' }, { $month: today }] };

      // const conditionFind = {
      //   $expr: {
      //     $and: [eqDay, eqMonth],
      //   },
      // };

      console.log("««««« conditionFind »»»»»", conditionFind);

      let results = await Customer.find(conditionFind);

      let total = await Customer.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question7: async (req, res, next) => {
    try {
      const { status } = req.query;

      let results = await Order.find({ status }) // ~ match
        .populate({ path: "customer", select: "firstName lastName" }) // select để chọn lọc dữ liệu trả về
        // .populate('customer')
        .populate("employee")
        .populate({
          path: "orderDetails.product",
          select: { name: 1, stock: 1 },
        })
        .lean();

      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question7a: async (req, res, next) => {
    try {
      const { status } = req.query;

      let results = await Order.aggregate()
        .match({ status }) // ~ find
        .lookup({
          from: "customers",
          localField: "customerId",
          foreignField: "_id",
          as: "Customer",
        })
        .unwind("Customer")
        .lookup({
          from: "employees",
          localField: "employeeId",
          foreignField: "_id",
          as: "employee",
        })
        .unwind("employee")
        .project({
          customerId: 0,
          employeeId: 0,
          // shippedDate: 0,
          // paymentType: 0,
          // status: 0,
          // orderDetails: 0,
          // createdDate: 0,
        });
      // .lookup({
      //   from: 'products',
      //   localField: 'orderDetails.productId',
      //   foreignField: '_id',
      //   as: 'orderDetails.product',
      // })
      // .unwind('product')
      // .populate({ path: 'customer', select: 'firstName lastName' })
      // .populate('employee')
      // .populate({
      //   path: 'orderDetails.product',
      //   select: { name: 1 , stock: 1},
      // })
      // .select('-customerId -employeeId -orderDetails.productId')
      // .lean();

      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question8a: async (req, res, next) => {
    try {
      let { status, date } = req.query;
      const findDate = date ? new Date(date) : new Date();

      const conditionFind = {
        $expr: {
          $and: [
            // { $eq: ['$status', status] },
            { status },
            {
              $eq: [{ $dayOfMonth: "$shippedDate" }, { $dayOfMonth: findDate }],
            },
            { $eq: [{ $month: "$shippedDate" }, { $month: findDate }] },
            { $eq: [{ $year: "$shippedDate" }, { $year: findDate }] },
          ],
        },
      };

      console.log("««««« conditionFind »»»»»", conditionFind);

      let results = await Order.find(conditionFind).lean();

      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question8b: async (req, res, next) => {
    try {
      let { status, fromDate, toDate } = req.query;

      fromDate = new Date(fromDate);
      fromDate.setHours(0, 0, 0, 0);

      const tmpToDate = new Date(toDate);
      tmpToDate.setHours(0, 0, 0, 0);
      toDate = new Date(tmpToDate.setDate(tmpToDate.getDate() + 1));

      const compareStatus = { $eq: ["$status", status] };
      const compareFromDate = { $gte: ["$shippedDate", fromDate] };
      const compareToDate = { $lt: ["$shippedDate", toDate] };

      const conditionFind = {
        $expr: { $and: [compareStatus, compareFromDate, compareToDate] },
      };

      let results = await Order.find(conditionFind)
        .populate("orderDetails.product")
        .populate("customer")
        .populate("employee")
        .lean();

      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question13: async (req, res, next) => {
    try {
      let { address } = req.query;

      let results = await Order.aggregate()
        .lookup({
          from: "customers",
          localField: "customerId",
          foreignField: "_id",
          as: "customer",
        })
        .unwind("customer")
        .match({
          "customer.address": {
            $regex: new RegExp(`${address}`),
            $options: "i",
          },
        })
        .project({
          customerId: 0,
          employeeId: 0,
        });

      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question15: async (req, res, next) => {
    try {
      let { supplierNames } = req.query;

      let conditionFind = {
        name: { $in: supplierNames },
      };

      let results = await Supplier.find(conditionFind);

      let total = await Supplier.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question18: async (req, res, next) => {
    try {
      let results = await Category.aggregate()
        // .lookup({ // so sánh
        //   from: 'customers',
        //   localField: 'customerId',
        //   foreignField: '_id',
        //   as: 'customer'
        // })
        .lookup({
          from: "products",
          localField: "_id", // TRUY VẤN NGƯỢC!!!
          foreignField: "categoryId",
          as: "products",
        })
        // .unwind('products') //   sẽ dẫn dến thiếu dự liệu
        .unwind({
          path: "$products",
          preserveNullAndEmptyArrays: true,
        })
        .group({
          _id: "$_id",
          name: { $first: "$name" },
          description: { $first: "$description" },
          totalProduct: {
            $sum: "$products.stock",
          },
        })
        .sort({
          totalProduct: -1,
          name: 1,
        });

      let total = await Category.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question19: async (req, res, next) => {
    try {
      let results = await Supplier.aggregate()
        .lookup({
          from: "products",
          localField: "_id",
          foreignField: "supplierId",
          as: "products",
        })
        .unwind({
          path: "$products",
          preserveNullAndEmptyArrays: true,
        })
        .group({
          _id: "$_id",
          name: { $first: "$name" },
          totalProduct: {
            $sum: "$products.stock",
          },
          // count: {$cond: { if: {$gt: ['$products', 0]}, then: 1, else: 0} }
          // count: {
          //   $sum: {$cond: { if: {
          //     $and : [
          //       {$lt: ['$products.stock', 100]},
          //       {$gt: ['$products.stock', 0]},
          //     ]
          //   }, then: 1, else: 0} },
          // },
        })
        .sort({
          totalProduct: -1,
          name: 1,
        });

      let total = await Supplier.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question20: async (req, res, next) => {
    try {
      let { fromDate, toDate } = req.query;
      const conditionFind = getQueryDateTime(fromDate, toDate);

      let results = await Order.aggregate()
        .match({
          ...conditionFind,
          status: { $in: ["COMPLETE"] },
        })
        .unwind("orderDetails")
        .lookup({
          from: "products",
          localField: "orderDetails.productId",
          foreignField: "_id",
          as: "orderDetails.product",
        })
        .unwind("orderDetails.product")
        .group({
          _id: "$orderDetails.productId",
          name: { $first: "$orderDetails.product.name" },
          price: { $first: "$orderDetails.product.price" },
          discount: { $first: "$orderDetails.product.discount" },
          stock: { $first: "$orderDetails.product.stock" },
          count: { $sum: 1 },
        });

      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question21: async (req, res, next) => {
    try {
      let { fromDate, toDate } = req.query;
      const conditionFind = getQueryDateTime(fromDate, toDate);

      let results = await Order.aggregate()
        .match(conditionFind)
        .lookup({
          from: "customers",
          localField: "customerId",
          foreignField: "_id",
          as: "customer",
        })
        .unwind("customer")
        .group({
          _id: "$customer._id",
          firstName: { $first: "$customer.firstName" },
          lastName: { $first: "$customer.lastName" },
          email: { $first: "$customer.email" },
          phoneNumber: { $first: "$customer.phoneNumber" },
          address: { $first: "$customer.address" },
          birthday: { $first: "$customer.birthday" },
        });

      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question22: async (req, res, next) => {
    try {
      let { fromDate, toDate } = req.query;
      const conditionFind = getQueryDateTime(fromDate, toDate);

      let results = await Order.aggregate()
        .match(conditionFind)
        .unwind({
          path: "$orderDetails",
          preserveNullAndEmptyArrays: true,
        })
        .addFields({
          total: {
            $sum: {
              $divide: [
                {
                  $multiply: [
                    "$orderDetails.price",
                    { $subtract: [100, "$orderDetails.discount"] },
                    "$orderDetails.quantity",
                  ],
                },
                100,
              ],
            },
          },
        })
        .group({
          _id: "$customerId",
          total: { $sum: "$total" },
        });

      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question23: async (req, res, next) => {
    try {
      let { fromDate, toDate } = req.query;
      const conditionFind = getQueryDateTime(fromDate, toDate);

      let results = await Order.aggregate()
        .match(conditionFind)
        .unwind({
          path: "$orderDetails",
          preserveNullAndEmptyArrays: true,
        })
        .addFields({
          total: {
            $sum: {
              $divide: [
                {
                  $multiply: [
                    "$orderDetails.price",
                    { $subtract: [100, "$orderDetails.discount"] },
                    "$orderDetails.quantity",
                  ],
                },
                100,
              ],
            },
          },
        })
        .group({
          _id: null,
          total: { $sum: "$total" },
        });

      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question24: async (req, res, next) => {
    try {
      // let { fromDate, toDate } = req.query;
      // const conditionFind = getQueryDateTime(fromDate, toDate);

      let results = await Order.aggregate()
        // .match(conditionFind)
        .unwind({
          path: "$orderDetails",
          preserveNullAndEmptyArrays: true,
        })
        .addFields({
          total: {
            $sum: {
              $divide: [
                {
                  $multiply: [
                    "$orderDetails.price",
                    { $subtract: [100, "$orderDetails.discount"] },
                    "$orderDetails.quantity",
                  ],
                },
                100,
              ],
            },
          },
        })
        .group({
          _id: "$employeeId",
          total: { $sum: "$total" },
        })
        .lookup({
          from: "employees",
          localField: "_id",
          foreignField: "_id",
          as: "employee",
        })
        .unwind("employee")
        .project({
          totalPrice: "$total",
          firstName: "$employee.firstName",
          lastName: "$employee.lastName",
          phoneNumber: "$employee.phoneNumber",
          address: "$employee.address",
          email: "$employee.email ",
        });

      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question25: async (req, res, next) => {
    try {
      let results = await Product.aggregate()
        .lookup({
          from: "orders",
          localField: "_id",
          foreignField: "orderDetails.productId",
          as: "orders",
        })
        .match({
          orders: { $size: 0 },
        })
        .project({
          id: 1,
          name: 1,
          price: 1,
          stock: 1,
        });

      let total = await Product.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question26: async (req, res, next) => {
    try {
      let { fromDate, toDate } = req.query;
      fromDate = new Date(fromDate);

      const tmpToDate = new Date(toDate);
      toDate = new Date(tmpToDate.setDate(tmpToDate.getDate() + 1));

      let results = await Product.aggregate()
        .lookup({
          from: "orders",
          localField: "_id",
          foreignField: "orderDetails.productId",
          as: "orders",
        })
        .unwind({
          path: "$orders",
          preserveNullAndEmptyArrays: true,
        })
        .match({
          $or: [
            {
              $and: [
                { orders: { $ne: null } },
                {
                  $or: [
                    { "orders.createdDate": { $lte: fromDate } },
                    { "orders.createdDate": { $gte: toDate } },
                  ],
                },
              ],
            },
            {
              orders: null,
            },
          ],
        })
        .lookup({
          from: "suppliers",
          localField: "supplierId",
          foreignField: "_id",
          as: "suppliers",
        })
        .project({
          _id: 0,
          suppliers: 1,
        })
        .unwind("suppliers")
        .project({
          _id: "$suppliers._id",
          name: "$suppliers.name",
          email: "$suppliers.email",
          phoneNumber: "$suppliers.phoneNumber",
          address: "$suppliers.address",
        })
        .group({
          _id: "$_id",
          name: { $first: "$name" },
          phoneNumber: { $first: "$phoneNumber" },
          email: { $first: "$email" },
          address: { $first: "$address" },
        });

      let total = await Product.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question26b: async (req, res, next) => {
    try {
      let { fromDate, toDate } = req.query;
      fromDate = new Date(fromDate);

      const tmpToDate = new Date(toDate);
      toDate = new Date(tmpToDate.setDate(tmpToDate.getDate() + 1));

      let results = await Supplier.aggregate()
        .lookup({
          from: "products",
          localField: "_id",
          foreignField: "supplierId",
          as: "products",
        })
        .unwind({
          path: "$products",
          preserveNullAndEmptyArrays: true,
        })
        .lookup({
          from: "orders",
          localField: "products._id",
          foreignField: "orderDetails.productId",
          as: "orders",
        })
        .unwind({
          path: "$orders",
          preserveNullAndEmptyArrays: true,
        });
      // .match({
      //   $or: [
      //     {
      //       $and: [
      //         { orders: { $ne: null } },
      //         {
      //           $or: [
      //             { 'orders.createdDate': { $lte: fromDate } },
      //             { 'orders.createdDate': { $gte: toDate } },
      //           ],
      //         },
      //       ],
      //     },
      //     {
      //       orders: null,
      //     },
      //   ],
      // })
      // .lookup({
      //   from: 'suppliers',
      //   localField: 'supplierId',
      //   foreignField: '_id',
      //   as: 'suppliers',
      // })
      // .project({
      //   _id: 0,
      //   suppliers: 1,
      // })
      // .unwind('suppliers')
      // .project({
      //   _id: '$suppliers._id',
      //   name: '$suppliers.name',
      //   email: '$suppliers.email',
      //   phoneNumber: '$suppliers.phoneNumber',
      //   address: '$suppliers.address',
      // })
      // .group({
      //   _id: '$_id',
      //   name: { $first: '$name' },
      //   phoneNumber: { $first: '$phoneNumber' },
      //   email: { $first: '$email' },
      //   address: { $first: '$address' },
      // })

      let total = await Supplier.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  // Không lọc theo ngày tháng
  question26c: async (req, res, next) => {
    try {
      let results = await Product.aggregate()
        .lookup({
          from: "orders",
          localField: "_id",
          foreignField: "orderDetails.productId",
          as: "orders",
        })
        .unwind({
          path: "$orders",
          preserveNullAndEmptyArrays: true,
        })
        // thêm bộ lọc ngày tháng ở đây nếu có
        .group({
          _id: "$supplierId",
          ordersArr: { $push: "$orders" },
        })
        .match({
          ordersArr: { $size: 0 },
        })
        .lookup({
          from: "suppliers",
          localField: "_id",
          foreignField: "_id",
          as: "supplier",
        })
        .unwind("supplier")
        .project({
          name: "$supplier.name",
          email: "$supplier.email",
          phoneNumber: "$supplier.phoneNumber",
          address: "$supplier.address",
        });

      let total = await Supplier.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question27: async (req, res, next) => {
    try {
      let { fromDate, toDate } = req.query;
      const conditionFind = getQueryDateTime(fromDate, toDate);

      let results = await Order.aggregate()
        .match(conditionFind)
        .unwind("orderDetails")
        .addFields({
          "orderDetails.originalPrice": {
            $divide: [
              {
                $multiply: [
                  "$orderDetails.price",
                  { $subtract: [100, "$orderDetails.discount"] },
                ],
              },
              100,
            ],
          },
        })
        .group({
          _id: "$employeeId",
          // firstName: { $first: '$employees.firstName' },
          // lastName: { $first: '$employees.lastName' },
          // email: { $first: '$employees.email' },
          // phoneNumber: { $first: '$employees.phoneNumber' },
          // address: { $first: '$employees.address' },
          // birthday: { $first: '$employees.birthday' },
          totalSales: {
            $sum: {
              $multiply: [
                "$orderDetails.originalPrice",
                "$orderDetails.quantity",
              ],
            },
          },
        })
        .lookup({
          from: "employees",
          localField: "_id",
          foreignField: "_id",
          as: "employees",
        })
        .unwind("employees")
        .project({
          employeeId: "$_id",
          firstName: "$employees.firstName",
          lastName: "$employees.lastName",
          phoneNumber: "$employees.phoneNumber",
          address: "$employees.address",
          email: "$employees.email",
          totalSales: 1,
        })
        .sort({ totalSales: -1 })
        .limit(3)
        .skip(0);

      // .group({
      //   _id: '$totalSales',
      //   employees: { $push: '$$ROOT' },
      // })
      // // .sort({ _id: -1 })

      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  // question29: async (req, res, next) => {
  //   try {
  //     let results = await Product.aggregate()
  //     .group({
  //       _id: '$discount',
  //     })
  //     .project({
  //       discount: '$_id',
  //     })

  //     let total = await Product.countDocuments();

  //     return res.send({
  //       code: 200,
  //       total,
  //       totalResult: results.length,
  //       payload: results,
  //     });
  //   } catch (err) {
  //     console.log('««««« err »»»»»', err);
  //     return res.status(500).json({ code: 500, error: err });
  //   }
  // },

  question29: async (req, res, next) => {
    try {
      let results = await Product.distinct("discount");
      // let results = await Order.distinct('orderDetails.discount')

      return res.send({
        code: 200,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question30: async (req, res, next) => {
    try {
      let results = await Category.aggregate()
        .lookup({
          from: "products",
          localField: "_id",
          foreignField: "categoryId",
          as: "products",
        })
        .unwind({
          path: "$products",
          preserveNullAndEmptyArrays: true,
        })
        .lookup({
          from: "orders",
          localField: "products._id",
          foreignField: "orderDetails.productId",
          as: "orders",
        })
        .unwind({
          path: "$orders",
          preserveNullAndEmptyArrays: true,
        })
        .unwind({
          path: "$orders.orderDetails",
          preserveNullAndEmptyArrays: true,
        })
        .addFields({
          originalPrice: {
            $divide: [
              {
                $multiply: [
                  "$orders.orderDetails.price",
                  { $subtract: [100, "$orders.orderDetails.discount"] },
                ],
              },
              100,
            ],
          },
          amount: "$orders.orderDetails.quantity",
        })
        .group({
          _id: "$_id",
          name: { $first: "$name" },
          description: { $first: "$description" },
          total: {
            $sum: { $multiply: ["$originalPrice", "$amount"] },
          },
        });

      let total = await Category.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question33: async (req, res, next) => {
    try {
      let { fromDate, toDate } = req.query;
      const conditionFind = getQueryDateTime(fromDate, toDate);

      let results = await Order.aggregate()
        .match(conditionFind)
        .unwind("orderDetails")
        .addFields({
          originalPrice: {
            $divide: [
              {
                $multiply: [
                  "$orderDetails.price",
                  { $subtract: [100, "$orderDetails.discount"] },
                ],
              },
              100,
            ],
          },
        })
        .group({
          _id: "$_id",
          createdDate: { $first: "$createdDate" },
          shippedDate: { $first: "$shippedDate" },
          status: { $first: "$status" },
          total: {
            $sum: { $multiply: ["$originalPrice", "$orderDetails.quantity"] },
          },
        })
        .group({
          _id: "$total",
          orders: { $push: "$$ROOT" },
        })
        .sort({ _id: 1 })
        .skip(0)
        .limit(1)
        .unwind("orders")
        .project({
          _id: "$orders._id",
          createdDate: "$orders.createdDate",
          shippedDate: "$orders.shippedDate",
          status: "$orders.status",
          total: "$orders.total",
        });

      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  question34: async (req, res, next) => {
    try {
      let { fromDate, toDate } = req.query;
      const conditionFind = getQueryDateTime(fromDate, toDate);

      let results = await Order.aggregate()
        .match(conditionFind)
        .unwind("orderDetails")
        .addFields({
          originalPrice: {
            $divide: [
              {
                $multiply: [
                  "$orderDetails.price",
                  { $subtract: [100, "$orderDetails.discount"] },
                ],
              },
              100,
            ],
          },
        })
        .group({
          _id: "$_id",
          createdDate: { $first: "$createdDate" },
          shippedDate: { $first: "$shippedDate" },
          status: { $first: "$status" },
          shippingAddress: { $first: "$shippingAddress" },
          description: { $first: "$description" },
          total: {
            $sum: { $multiply: ["$originalPrice", "$orderDetails.quantity"] },
          },
        })
        .group({
          _id: null,
          avg: { $avg: "$total" },
        })
        .project({
          _id: 0,
          avg: 1,
        });

      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },
  flashsale: async (req, res, next) => {
    try {
      const conditionFind = {
        discount: { $gt: 10 },
      };

      let results = await Product.find(conditionFind).sort({ discount: -1 });
      let total = await Product.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },
  bestseller: async (req, res, next) => {
    try {
      let results = await Order.aggregate()
        .match({
          status: "COMPLETED",
        })
        .unwind("orderDetails")
        .lookup({
          from: "products",
          localField: "orderDetails.productId",
          foreignField: "_id",
          as: "orderDetails.product",
        })
        .unwind("orderDetails.product")
        .addFields({
          discountedPrice: {
            $divide: [
              {
                $multiply: [
                  "$orderDetails.product.price",
                  { $subtract: [100, "$orderDetails.product.discount"] },
                ],
              },
              100,
            ],
          },
        })
        .group({
          _id: "$orderDetails.productId",
          name: { $first: "$orderDetails.product.name" },
          price: { $first: "$orderDetails.product.price" },
          discountedPrice: { $first: "$discountedPrice" },
          discount: { $first: "$orderDetails.product.discount" },
          quantity: { $sum: "$orderDetails.quantity" },
          stock: { $first: "$orderDetails.product.stock" },
          photo: { $first: "$orderDetails.product.photo" },
          count: { $sum: 1 },
        })
        .sort({ quantity: -1 });
      let total = await Order.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },
  productlist: async (req, res, next) => {
    try {
      const { limit, skip } = req.query;
      const conditionFind = {
        discount: { $lte: 100 },
      };
      let results = await Product.aggregate()
        .addFields({
          discountedPrice: {
            $divide: [
              {
                $multiply: ["$price", { $subtract: [100, "$discount"] }],
              },
              100,
            ],
          },
        })
        .match(conditionFind)
        .skip(parseInt(skip))
        .limit(parseInt(limit));
      let total = await Product.countDocuments();

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  productSearch: async (req, res, next) => {
    try {
      const { name } = req.query;
      const conditionFind = {
        name: { $regex: new RegExp(`${name}`), $options: "i" },
      };
      let results = await Product.find(conditionFind)
        .populate("category")
        .populate("supplier");
      return res.send({ code: 200, payload: results });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  productSimilar: async (req, res, next) => {
    try {
      const { name } = req.query;

      // Tách các từ trong tên sản phẩm đang xem
      const keywords = name.split(" ");

      // Tạo biểu thức chính quy để tìm kiếm các từ giống nhau
      const regex = new RegExp(keywords.join("|"), "i");

      const conditionFind = {
        name: { $regex: regex },
      };

      let results = await Product.find(conditionFind)
        .populate("category")
        .populate("supplier");

      return res.send({
        code: 200,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  filterCategory: async (req, res, next) => {
    try {
      const { categoryIds, minPrice, maxPrice, sortBy } = req.query;

      let categoryObjectIds = categoryIds
        .split(",")
        .map((categoryId) => new ObjectId(categoryId));

      let query = { categoryId: { $in: categoryObjectIds } };

      if (minPrice && maxPrice) {
        query.$expr = {
          $and: [
            {
              $gte: [
                { $multiply: ["$price", { $subtract: [100, "$discount"] }] },
                { $multiply: [Number(minPrice), 100] },
              ],
            },
            {
              $lte: [
                { $multiply: ["$price", { $subtract: [100, "$discount"] }] },
                { $multiply: [Number(maxPrice), 100] },
              ],
            },
          ],
        };
      } else if (minPrice) {
        query.$expr = {
          $gte: [
            { $multiply: ["$price", { $subtract: [100, "$discount"] }] },
            { $multiply: [Number(minPrice), 100] },
          ],
        };
      } else if (maxPrice) {
        query.$expr = {
          $lte: [
            { $multiply: ["$price", { $subtract: [100, "$discount"] }] },
            { $multiply: [Number(maxPrice), 100] },
          ],
        };
      }

      let results;
      if (sortBy === "discountLowToHigh") {
        results = await Product.find(query).sort({ discount: 1 });
      } else if (sortBy === "discountHighToLow") {
        results = await Product.find(query).sort({ discount: -1 });
      } else if (sortBy === "bestSelling") {
        // Sử dụng câu truy vấn tìm sản phẩm bán chạy nhất như một subquery
        const bestSellingProductIds = await Order.aggregate([
          { $match: { status: "COMPLETED" } },
          { $unwind: "$orderDetails" },
          {
            $group: {
              _id: "$orderDetails.productId",
              totalQuantity: { $sum: "$orderDetails.quantity" },
            },
          },
          { $sort: { totalQuantity: -1 } },
          { $limit: 10 }, // Lấy 10 sản phẩm bán chạy nhất
        ]).exec(); // Sử dụng .exec() để thực hiện truy vấn và trả về kết quả dưới dạng mảng

        const bestSellingIds = bestSellingProductIds.map(
          (product) => product._id
        ); // Sử dụng .map() trên mảng

        query._id = { $in: bestSellingIds };

        results = await Product.find(query);
      } else if (sortBy === "priceLowToHigh") {
        results = await Product.find(query).sort({ price: 1 });
      } else if (sortBy === "priceHighToLow") {
        results = await Product.find(query).sort({ price: -1 });
      } else if (sortBy === "newest") {
        results = await Product.find(query).sort({ createdAt: -1 });
      } else {
        results = await Product.find(query);
      }

      let total = results.length;

      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },
  //Tính ra tổng nhân viên
  totalstaff: async (req, res, next) => {
    try {
      // Điều kiện để tính tổng số nhân viên
      // Bạn muốn tính tổng số nhân viên đang làm việc (isActive = true).
      const conditionFind = {
        isActive: true,
      };

      // Thực hiện truy vấn để lấy những nhân viên thỏa điều kiện
      let results = await Employee.find(conditionFind).lean();

      // Tính tổng số nhân viên trong cơ sở dữ liệu
      let total = await Employee.countDocuments();

      // Trả về kết quả dưới dạng JSON
      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  //Tính ra tổng sản phẩm
  grossproduct: async (req, res, next) => {
    try {
      // Điều kiện để lấy tất cả sản phẩm (có thể không cần điều kiện)
      const conditionFind = {};

      // Thực hiện truy vấn để lấy những sản phẩm thỏa điều kiện
      let results = await Product.find(conditionFind).lean();

      // Tính tổng số sản phẩm trong cơ sở dữ liệu
      let total = await Product.countDocuments();

      // Trả về kết quả dưới dạng JSON
      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  //Tính ra tổng đơn hàng
  totalorder: async (req, res, next) => {
    try {
      // Điều kiện để lấy tất cả sản phẩm (có thể không cần điều kiện)
      const conditionFind = {};

      // Thực hiện truy vấn để lấy những sản phẩm thỏa điều kiện
      let results = await Order.find(conditionFind).lean();

      // Tính tổng số sản phẩm trong cơ sở dữ liệu
      let total = await Order.countDocuments();

      // Trả về kết quả dưới dạng JSON
      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  //Tính tổng thu nhập dự trên price, discount, quantity, status

  totalIncome: async (req, res, next) => {
    try {
      const conditionFind = {
        status: "COMPLETED", //trạng thái đơn hàng đã hoàn thành
      };

      const totalIncomeResult = await Order.aggregate([
        { $match: conditionFind }, // Lọc các đơn hàng theo điều kiện conditionFind
        { $unwind: "$orderDetails" }, // Tách các phần tử trong mảng orderDetails thành từng document riêng biệt
        {
          $group: {
            _id: null,
            //Công thức totalIncome = SUM(price * quantity * (1 - discount/100))
            //1 - discount/100: giá trị sau khi áp dụng giảm giá
            totalIncome: {
              $sum: {
                $multiply: [
                  {
                    $multiply: [
                      "$orderDetails.price",
                      "$orderDetails.quantity",
                    ],
                  },
                  { $subtract: [1, { $divide: ["$discount", 100] }] }, // Áp dụng giảm giá theo đơn vị %
                ],
              },
            },
          },
        }, // Nhóm và tính tổng thu nhập sau khi áp dụng giảm giá từ tích giữa giá và số lượng trong mảng orderDetails
        { $project: { _id: 0, totalIncome: 1 } }, // Chỉ trả về trường totalIncome
      ]);

      // Kiểm tra trường totalIncome trong kết quả truy vấn
      if (
        totalIncomeResult[0] &&
        totalIncomeResult[0].totalIncome !== undefined
      ) {
        // Nếu tồn tại, lấy giá trị tổng thu nhập từ kết quả truy vấn
        const totalIncome = parseFloat(totalIncomeResult[0].totalIncome);
        // Trả về kết quả dưới dạng JSON với số thực là totalIncome
        return res.send({
          code: 200,
          message: "Tính tổng thu nhập thành công",
          totalIncome: totalIncome,
        });
      } else {
        // Nếu không tồn tại, gán giá trị mặc định cho totalIncome
        const defaultTotalIncome = 0;
        // Trả về kết quả dưới dạng JSON với giá trị mặc định cho totalIncome
        return res.send({
          code: 200,
          totalIncome: defaultTotalIncome,
        });
      }
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  //Tính tổng đơn hàng bị hủy
  canceledorder: async (req, res, next) => {
    try {
      const conditionFind = {
        status: "CANCELED", //trạng thái đơn hàng bị hủy
      };

      // Thực hiện truy vấn để lấy những sản phẩm thỏa điều kiện
      let results = await Order.find(conditionFind).lean();

      // Tính tổng số sản phẩm trong cơ sở dữ liệu
      let total = await Order.countDocuments();

      // Trả về kết quả dưới dạng JSON
      return res.send({
        code: 200,
        total,
        totalResult: results.length,
        payload: results,
      });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  //Tính tổng sản phẩm hết hàng
  outstock: async (req, res, next) => {
    try {
      const conditionFind = {
        stock: 0, // số lượng trong kho bằng 0
      };

      //cách 1
      // // Thực hiện truy vấn để lấy những sản phẩm thỏa điều kiện
      // let results = await Order.find(conditionFind).lean();

      // // Tính tổng số sản phẩm trong cơ sở dữ liệu
      // let total = await Order.countDocuments();

      //Cách 2
      // Sử dụng Aggregation Framework để tính tổng số sản phẩm hết hàng
      const totalOutstock = await Product.aggregate([
        { $match: conditionFind }, // Lọc các sản phẩm thỏa điều kiện
        { $count: "totalOutstock" }, // Tính tổng số sản phẩm hết hàng
      ]);

      // Kiểm tra nếu mảng totalOutstock rỗng, trả về 0
      const totalOutstockCount =
        totalOutstock.length > 0 ? totalOutstock[0].totalOutstock : 0;

      // Trả về kết quả dưới dạng JSON
      return res.send({
        code: 200,
        totalOutstock: totalOutstockCount,
      });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  //Tính tổng số nhân viên mới
  // countNewEmployees: async (req, res, next) => {
  //   try {
  //     // Để tính tổng số nhân viên mới, sử dụng điều kiện là 'isActive: true' (nhân viên đang hoạt động)
  //     // và 'createdAt' trong khoảng thời gian từ bắt đầu ngày hiện tại đến cuối ngày hiện tại
  //     const today = new Date();
  //     today.setUTCHours(0, 0, 0, 0); // Đưa về thời điểm bắt đầu của ngày hiện tại
  //     const nextDay = new Date(today);
  //     nextDay.setUTCDate(nextDay.getUTCDate() + 1); // Lấy ngày tiếp theo để đến cuối ngày hiện tại

  //     const conditionFind = {
  //       isActive: true,
  //       createdAt: {
  //         $gte: today, // Ngày tạo phải lớn hơn hoặc bằng ngày bắt đầu
  //         $lt: nextDay, // Ngày tạo phải nhỏ hơn ngày tiếp theo (đến cuối ngày)
  //       },
  //     };
  //     const totalNewEmployees = await Employee.countDocuments(conditionFind);
  //     return res.send({
  //       code: 200,
  //       message: "Tổng số nhân viên mới",
  //       totalNewEmployees: totalNewEmployees,
  //     });
  //   } catch (err) {
  //     return res.status(500).json({ code: 500, error: err });
  //   }
  // },

  // Tính tổng số nhân viên mới trong 1 tuần gần nhất
  countNewEmployees: async (req, res, next) => {
    try {
      // Để tính tổng số nhân viên mới, sử dụng điều kiện là 'isActive: true' (nhân viên đang hoạt động)
      // và 'createdAt' trong khoảng thời gian từ bắt đầu ngày tuần trước đến cuối ngày hiện tại
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0); // Đưa về thời điểm bắt đầu của ngày hiện tại
      const oneWeekAgo = new Date(today);
      oneWeekAgo.setUTCDate(oneWeekAgo.getUTCDate() - 7); // Lấy ngày bắt đầu của tuần trước

      const conditionFind = {
        isActive: true,
        createdAt: {
          $gte: oneWeekAgo, // Ngày tạo phải lớn hơn hoặc bằng ngày bắt đầu của tuần trước
          $lt: today, // Ngày tạo phải nhỏ hơn ngày hiện tại (đến cuối ngày)
        },
      };

      const totalNewEmployees = await Employee.countDocuments(conditionFind);
      return res.send({
        code: 200,
        message: "Tổng số nhân viên mới trong 1 tuần gần nhất",
        totalNewEmployees: totalNewEmployees,
      });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  //Tính tổng sản phẩm sắp hết hàng
  outstock1: async (req, res, next) => {
    try {
      const conditionFind = {
        stock: { $lt: 10 }, // số lượng trong kho nhỏ hơn 10
      };
      // Sử dụng Aggregation Framework để tính tổng số sản phẩm hết hàng
      const totalOutstock = await Product.aggregate([
        { $match: conditionFind }, // Lọc các sản phẩm thỏa điều kiện
        { $count: "totalOutstock" }, // Tính tổng số sản phẩm hết hàng
      ]);

      // Kiểm tra nếu mảng totalOutstock rỗng, trả về 0
      const totalOutstockCount =
        totalOutstock.length > 0 ? totalOutstock[0].totalOutstock : 0;

      // Trả về kết quả dưới dạng JSON
      return res.send({
        code: 200,
        totalOutstock: totalOutstockCount,
      });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  //Hiển thị danh sách top 5 sản phẩm bán chạy nhất
  bestsellerlist: async (req, res, next) => {
    try {
      // Thực hiện truy vấn để lấy thông tin từng sản phẩm và tính tổng số lượng đã bán
      const bestSellingProducts = await Order.aggregate([
        {
          $unwind: "$orderDetails", // Tách mảng orderDetails thành các tài liệu riêng biệt
        },
        {
          $group: {
            _id: "$orderDetails.productId", // Nhóm theo productId
            totalQuantity: { $sum: "$orderDetails.quantity" }, // Tính tổng số lượng của mỗi sản phẩm đã bán
          },
        },
        {
          $sort: { totalQuantity: -1 }, // Sắp xếp theo totalQuantity giảm dần
        },
        {
          $limit: 5, // Giới hạn chỉ lấy 5 sản phẩm
        },
        {
          $lookup: {
            from: "products", // Thay "products" bằng tên bộ sưu tập của mô hình Product
            localField: "_id",
            foreignField: "_id",
            as: "productInfo",
          },
        },
        {
          $unwind: "$productInfo", // Tách mảng productInfo thành các tài liệu riêng biệt
        },
        {
          $project: {
            _id: 1,
            totalQuantity: 1,
            name: "$productInfo.name",
            price: "$productInfo.price",
            discountedPrice: "$productInfo.discountedPrice", // Thêm discountedPrice vào kết quả
          },
        },
      ]);
  
      // Trả về kết quả dưới dạng JSON
      return res.send({
        code: 200,
        totalResult: bestSellingProducts.length,
        payload: bestSellingProducts,
      });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

};
