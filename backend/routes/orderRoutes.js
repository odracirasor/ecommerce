import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    type: String, // ou `mongoose.Schema.Types.ObjectId` se estiver autenticando
    required: true,
  },
  items: [
    {
      _id: String,
      name: String,
      price: Number,
      quantity: Number,
      image: String,
    }
  ],
  shipping: {
    nome: String,
    endereco: String,
    cidade: String,
    postal: String,
  },
  paymentMethod: String,
  total: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
