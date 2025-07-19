// checkProduct.js
import mongoose from 'mongoose';
import Product from './models/Product.js';

mongoose.connect('mongodb://localhost:27017/ecommerce')
  .then(async () => {
    const product = await Product.findById('6877764c14f3213dcf16d634');
    console.log(product);
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Erro de conexão:', err);
  });
