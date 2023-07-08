const { default: mongoose } = require('mongoose');
const { Supplier } = require('../../../models');

// mongoose.connect('mongodb://localhost:27017/batch-29-30-database');
mongoose.connect('mongodb://127.0.0.1:27017/batch-29-30-database');

try {
  const data = {
    name: 'Nhà cung cấp đồ ăn',
    email: 'nccda@gmail.com',
    phoneNumber: '0386592529',
    address: '39 Yên Bái',
  };

  const newData = new Supplier(data);

  newData.save().then((result) => {
    console.log('««««« result »»»»»', result);
  });
} catch (err) {
  console.log('««««« err »»»»»', err);
}