var express = require('express');
var router = express.Router();
const yup = require('yup');

const { generationID, writeFileSync } = require('../../../utils');

let products = require('../../data/products.json');

// GET LIST
router.get('/', function(req, res, next) {
  res.status(200).json({
    code: 2001,
    message: 'Get success!!',
    total: products.length,
    payload: products,
  });
});

// GET DETAIL
router.get('/:id', function(req, res, next) {
  const { id } = req.params;

  const validationSchema = yup.object().shape({
    params: yup.object({
      id: yup.number().test('validationID', 'ID sai định dạng', val => {
        return val.toString().length === 13
      }),
    }),
  });

  validationSchema
    .validate({ params: req.params }, { abortEarly: false })
    .then(() => {
      console.log('Validation passed');

      const product = products.find((p) => p.id.toString() === id.toString());

      if (!product) {
        res.status(404).json({
          code: 4041,
          message: 'Get detail fail!!',
        });
      }
    
      res.status(200).json({
        code: 2001,
        message: 'Get detail success!!',
        payload: product,
      });
    })
    .catch((err) => {
      res.status(404).json({
        message: 'Get detail fail!!',
        payload: err,
      });
    });
});

// ADD NEW
router.post('/', function(req, res, next) {
  const phoneRegExp = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;

  const validationSchema = yup.object().shape({
    body: yup.object({
      name: yup.string().max(50).required(),
      price: yup.number().min(0, 'Giá phải lớn hơn hoặc bằng 0').required(),
      description: yup.string(),
      supplierId: yup.number().test('validationID', 'ID sai định dạng', val => {
        if (!val) return true;
  
        return val.toString().length === 13
      }),
      // phone: yup.string().matches(phoneRegExp, 'SỐ ĐIỆN THOẠI BỊ SAI').required('Số dt không được bỏ trống'),
      // isHasWife: yup.bool(),
      // wifeName: yup.string().test({
      //   message: 'Tên vợ không được để trống',
      //   test(value) {
      //       if (this.parent.isHasWife && !value) return false;
    
      //       return true;
      //     },
      // })
    })
  });  

  validationSchema
  .validate({ body: req.body }, { abortEarly: false })
  .then(() => {
    console.log('Validation passed');
    const { name, price, description, discount, supplierId } = req.body;

    const foundExists = products.find((item) => item.name === name);
    
    if (foundExists) {
      res.status(400).json({
        code: 2011,
        message: 'Sản phẩm đã tồn tại trong hệ thống',
      });
    }

    const initID = generationID();

    const newProduct = {
      id: initID,
      name,
      price,
      description,
      discount,
      // phone,
      // supplierId: supplierId && supplierId,
      ...(supplierId && { supplierId }),
    };

    // if (supplierId) {
    //   newProduct.supplierId = supplierId;
    // }

    products.push(newProduct);

    const newP = products.find((p) => p.id.toString() === initID.toString());
  
    writeFileSync('./data/products.json', products);
  
    res.status(201).json({
      code: 2011,
      message: 'Thêm sản phẩm thành công',
      payload: newP,
    });
  })
  .catch((err) => {
    return res.status(400).json({
      type: err.name,
      errors: err.errors,
      provider: 'yup'
    });
  });
});

// UPDATE
router.patch('/:id', function(req, res, next) {
  const validationSchema = yup.object().shape({
    body: yup.object({
      name: yup.string().max(50).required(),
      price: yup.number().min(0, 'Giá phải lớn hơn hoặc bằng 0').required(),
      description: yup.string(),
      // supplierId: yup.number().test('validationID', 'ID sai định dạng', val => {
      //   if (!val) return true;
  
      //   return val.toString().length === 13
      // }),
    }),
    params: yup.object({
      id: yup.number().test('validationID', 'ID sai định dạng', val => {
        return val.toString().length === 13
      }),
    }),
  });  

  validationSchema
  .validate({ body: req.body, params: req.params }, { abortEarly: false })
  .then(() => {
    console.log('Validation passed');
    const { name, price, description, discount } = req.body;
    const { id } = req.params;
    
    // Kiểm tra sản phẩm có tồn tại trong hệ thống
    const checkProductExits = products.find((p) => p.id.toString() === id.toString());

    if (!checkProductExits) {
      res.status(404).json({
        code: 4041,
        message: 'Not found',
      });
    }
  
    // Kiểm tra sản phẩm có trung tên với sản phẩm khác trong hệ thống
    const foundExists = products.find((item) => item.id.toString() !== id.toString() && item.name === name);

    if (foundExists) {
      res.status(400).json({
        code: 2011,
        message: 'Sản phẩm đã tồn tại trong hệ thống',
      });
    }

    const productUpdate = {
      ...checkProductExits,
      name,
      price,
      description,
      discount,
    }
  
    const newProductList = products.map((p) => {
      if (p.id.toString() === id.toString()) {
        return productUpdate;
      } 
  
      return p;
    })
  
    writeFileSync('./data/products.json', newProductList);
  
    res.status(201).json({
      code: 2011,
      message: 'Update success!!',
      payload: productUpdate,
    });
  })
  .catch((err) => {
    return res.status(400).json({
      type: err.name,
      errors: err.errors,
      provider: 'yup'
    });
  });
});

// UPDATE
router.put('/:id', function(req, res, next) {
  const validationSchema = yup.object().shape({
    body: yup.object({
      name: yup.string().max(50).required(),
      price: yup.number().min(0, 'Giá phải lớn hơn hoặc bằng 0').required(),
      description: yup.string(),
      supplierId: yup.number().test('validationID', 'ID sai định dạng', val => {
        if (!val) return true;
  
        return val.toString().length === 13
      }),
    }),
    params: yup.object({
      id: yup.number().test('validationID', 'ID sai định dạng', val => {
        return val.toString().length === 13
      }),
    }),
  });  

  validationSchema
  .validate({ body: req.body }, { abortEarly: false })
  .then(() => {
    console.log('Validation passed');
    const { name, price, description, discount } = req.body;
    const { id } = req.params;
  
    const foundExists = products.find((item) => item.id.toString() !== id.toString() && item.name === name);
  
    if (foundExists) {
      res.status(400).json({
        code: 2011,
        message: 'Sản phẩm đã tồn tại trong hệ thống',
      });
    }
  
    const checkProductExits = products.find((p) => p.id.toString() === id.toString());
  
    if (!checkProductExits) {
      res.status(404).json({
        code: 4041,
        message: 'Not found',
      });
    }
  
    const productUpdate = {
      ...checkProductExits,
      id: Number(id),
    }
  
    const newProductList = products.map((p) => {
      if (p.id.toString() === id.toString()) {
        return productUpdate;
      } 
  
      return p;
    })
  
    writeFileSync('./data/products.json', newProductList);
  
    res.status(201).json({
      code: 2011,
      message: 'Update success!!',
      payload: productUpdate,
    });
  })
  .catch((err) => {
    return res.status(400).json({
      type: err.name,
      errors: err.errors,
      provider: 'yup'
    });
  });
});

// DELETE
router.delete('/:id', function(req, res, next) {
  const validationSchema = yup.object().shape({
    params: yup.object({
      id: yup.number().test('validationID', 'ID sai định dạng', val => {
        return val.toString().length === 13
      }),
    }),
  });

  validationSchema
  .validate({ params: req.params }, { abortEarly: false })
  .then(() => {
    console.log('Validation passed');
    const { id } = req.params;

    const newProductList = products.filter((p) => p.id.toString() !== id.toString());

    products = newProductList;
  
    writeFileSync('./data/products.json', newProductList);
  
    res.status(201).json({
      code: 2011,
      message: 'Xóa sản phẩm thành công',
    });
  })
  .catch((err) => {
    res.status(404).json({
      message: 'Get detail fail!!',
      payload: err,
    });
  });
});

module.exports = router;
