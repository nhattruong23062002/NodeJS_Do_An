const { default: mongoose } = require('mongoose');
const { Category } = require('../../models');

// mongoose.connect('mongodb://localhost:27017/batch-29-30-database');
mongoose.connect('mongodb://127.0.0.1:27017/batch-29-30-database');

try {
  const category = {
    name: 'Món tráng khai vị',
    description: 'Mô tả món chính',
  };

  const newCategory = new Category(category);

  newCategory.save().then((result) => {
    console.log('««««« result »»»»»', result);
  });
} catch (err) {
  console.log('««««« err »»»»»', err);
}