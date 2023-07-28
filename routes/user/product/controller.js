
const { Product, Category, Supplier } = require('../../../models');

module.exports = {
  getProductAll: async (req, res, next) => {
    try {
      let results = await Product.find()
        .populate('category')
        .populate('supplier');
  
      return res.send({ code: 200, payload: results });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },
  
  getProductDetail: async (req, res, next) => {
    try {
      const { id } = req.params;
  
      let found = await Product.findById(id)
        .populate('category')
        .populate('supplier');
  
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

  createProduct: async function (req, res, next) {
    try {
      const data = req.body;

      const { categoryId, supplierId } = data;

      // Cách 1: validate từng dữ liệu
      // const findCategory = await Category.findById(categoryId);
      // console.log('««««« findCategory »»»»»', findCategory);

      // if (!findCategory || findCategory.isDelete) {
      //   return res.status(404).json({ code: 404, message: "Danh mục không tồn tại" });
      // }

      // const findSupplier = await Supplier.findById(supplierId);
      // if (!findSupplier) {
      //   return res.status(404).json({ code: 404, message: "Nhà cung cấp không tồn tại" });
      // }

      // const findCategory = await Category.findById(categoryId);

      // Cách 2: validate hàng loạt
      const findCategory = Category.findById(categoryId);
      const findSupplier = Supplier.findById(supplierId);

      const [category, supplier] = await Promise.all([findCategory, findSupplier]);

      const errors = [];
      if (!category || category.isDelete) errors.push('Danh mục không tồn tại');
      if (!supplier || supplier.isDelete) errors.push('Nhà cung cấp không tồn tại');

      if (errors.length > 0) {
        return res.status(404).json({
          code: 404,
          message: "Không tồn tại",
          errors,
        });
      }

      const newItem = new Product(data);
  
      let result = await newItem.save();
  
      return res.send({ code: 200, message: 'Tạo thành công', payload: result });
    } catch (err) {
      console.log('««««« err »»»»»', err);
      return res.status(500).json({ code: 500, error: err });
    }
  },

  deleteProduct: async function (req, res, next) {
    try {
      const { id } = req.params;
  
      let found = await Product.findByIdAndDelete(id);
  
      if (found) {
        return res.send({ code: 200, payload: found, message: 'Xóa thành công' });
      }
  
      return res.status(410).send({ code: 404, message: 'Không tìm thấy' });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  updateProduct: async function (req, res, next) {
    try {
      const { id } = req.params;  
      const updateData = req.body;

      const found = await Product.findByIdAndUpdate(id, updateData, {
        new: true,
      });
  
      if (found) {
        return res.send({
          code: 200,
          message: 'Cập nhật thành công',
          payload: found,
        });
      }
  
      return res.status(410).send({ code: 400, message: 'Không tìm thấy' });
    } catch (error) {
      return res.status(500).json({ code: 500, error: err });
    }
  },
};
