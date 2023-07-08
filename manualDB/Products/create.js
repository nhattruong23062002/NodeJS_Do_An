const { default: mongoose } = require('mongoose');
const { Product } = require('../../models');

// mongoose.connect('mongodb://localhost:27017/batch-29-30-database');
mongoose.connect('mongodb://127.0.0.1:27017/batch-29-30-database');

try {
  const data = {
    name: 'Bò kho',
    price: 50000,
    discount: 10,
    stock: 98,
    categoryId: '64677aa0ef1be17622e6ee95',
    supplierId: '64677a3adbdb940d36af8b86',
  };

  const newData = new Product(data);

  newData.save().then((result) => {
    console.log('««««« result »»»»»', result);
  });
} catch (err) {
  console.log('««««« err »»»»»', err);
}