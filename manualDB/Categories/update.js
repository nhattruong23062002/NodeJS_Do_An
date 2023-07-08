const { default: mongoose } = require('mongoose');
const { Category } = require('../../../models');

mongoose.connect('mongodb://127.0.0.1:27017/batch-29-30-database');

try {
  const id = '64677b03051af16a275c47c1';

  const data = { name: 'Món khai vị' };

  Category.findByIdAndUpdate(id, data, {
    new: true,
  }).then((result) => {
    console.log(result);
  });
} catch (err) {
  console.log(err);
}