const { Cart, Customer, Product } = require('../../../models');
const { asyncForEach } = require('../../../utils');

module.exports = {
  getDetail: async (req, res, next) => {
    try {
      const { id } = req.params;

      let found = await Cart.findOne({ customerId: id}).populate("products.productId");

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

  // create: async function (req, res, next) {
  //   try {
  //     const { customerId, productId, quantity } = req.body;

  //     const getCustomer = Customer.findById(customerId);
  //     const getProduct = Product.findById(productId);

  //     const [customer, foundProduct] = await Promise.all([
  //       getCustomer,
  //       getProduct,
  //     ]);

  //     const errors = [];
  //     if (!customer || customer.isDelete)
  //       errors.push('Khách hàng không tồn tại');
  //     if (!foundProduct || foundProduct.isDelete)
  //       errors.push('Sản phảm không tồn tại');

  //     if (foundProduct && quantity > foundProduct.stock)
  //       errors.push('Sản phảm vượt quá số lượng cho phép');

  //     if (errors.length > 0) {
  //       return res.status(404).json({
  //         code: 404,
  //         message: 'Lỗi',
  //         errors,
  //       });
  //     }

  //     const cart = await Cart.findOne({ customerId })

  //     const result = {};

  //     if (cart) { // GIỏ hàng đã tồn tại
  //       newProductCart = cart.products.map((item) => {
  //         if (productId === item.productId) {
  //           const nextQuantity = quantity + item.quantity;

  //           if (nextQuantity > foundProduct.stock) {
  //             return res.send({
  //               code: 404,
  //               message: `Số lượng sản phẩm ${product._id} không khả dụng`,
  //             });
  //           } else {
  //             item.quantity = nextQuantity;
  //           }
  //         }
  
  //         return item;
  //       })

  //       result = await Cart.findOneAndUpdate(cart._id, {
  //         customerId,
  //         products: newProductCart,
  //       });
  //     } else { // Chưa có giỏ hàng
  //       const newItem = new Cart({
  //         customerId,
  //         products: [
  //           {
  //             productId,
  //             quantity,
  //           }
  //         ]
  //       });
  
  //       result = await newItem.save();
  //     }

  //     return res.send({
  //       code: 200,
  //       message: 'Thêm sản phẩm thành công',
  //       payload: result,
  //     });
  //   } catch (err) {
  //     console.log('««««« err »»»»»', err);
  //     return res.status(500).json({ code: 500, error: err });
  //   }
  // },

  create: async function (req, res, next) {
    try {
      const { customerId, productId, quantity } = req.body;

      // const { _id: customerId } = req.user;

      // const getCustomer = Customer.findById(customerId);
      const getProduct =await Product.findById(productId);

      const [
        // customer,
        foundProduct] = await Promise.all([
        // getCustomer,
        getProduct,
      ]);

      const errors = [];
      // if (!customer || customer.isDelete)
      //   errors.push("Khách hàng không tồn tại");
      if (!foundProduct || foundProduct.isDelete)
        errors.push("Sản phẩm không tồn tại");

      if (foundProduct && quantity > foundProduct.stock)
        errors.push("Sản phảm vượt quá số lượng cho phép");

      if (errors.length > 0) {
        return res.status(404).json({
          code: 404,
          message: "Lỗi",
          errors,
        });
      }

      const cart = await Cart.findOne({ customerId }).lean();

      let result = {};

      if (cart) {
        // GIỏ hàng đã tồn tại
        let newProductCart = cart.products;
        const checkProductExits = newProductCart.find(
          (product) => product.productId.toString() === productId.toString()
        );

        if (!checkProductExits) {
          console.log("««««« không tồn tại»»»»»");
          newProductCart.push({
            productId,
            quantity,
          });
        } else {
          const nextQuantity = parseInt(checkProductExits.quantity) + parseInt(quantity);


          if (nextQuantity > foundProduct.stock) {
            return res.send({
              code: 404,
              message: `Số lượng sản phẩm không khả dụng`,
            });
          }

          newProductCart = newProductCart.map((item) => {
            const product = { ...item };
            if (productId.toString() === product.productId.toString()) {
              product.quantity = nextQuantity;
            }

            return product;
          });
        }

        result = await Cart.findByIdAndUpdate(
          cart._id,
          {
            customerId,
            products: newProductCart,
          },
          { new: true }
        );
      } else {
        // Chưa có giỏ hàng
        const newItem = new Cart({
          customerId,
          products: [
            {
              productId,
              quantity,
            },
          ],
        });

        result = await newItem.save();
      }

      return res.send({
        code: 200,
        message: "Thêm sản phẩm thành công",
        payload: result,
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  remove: async function (req, res, next) {
    try {
      const { customerId,productId } = req.body;

      let cart = await Cart.findOne({ customerId });

      console.log('««««« cart »»»»»', cart);

      if (!cart) {
        return res.status(404).json({
          code: 404,
          message: 'Giỏ hàng không tồn tại',
        });
      }

      if (cart.products.length === 1 && cart.products[0].productId === productId) {
        await Cart.deleteOne({ _id: cart._id });
      }else {
          await cart.updateOne({
            $pull: { products: { productId: productId } }
          });
      }

      return res.send({
        code: 200,
        message: 'Xóa thành công',
      });
    } catch (err) {
      console.log("««««« err »»»»»", err);
      return res.status(500).json({ code: 500, error: err });
    }
  },
};
