import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  orderItems: [
    {
      product: { type: String, required: true }, // id do produto
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      seller: { type: String },
      image: { type: String }, // URL da imagem do produto
      status: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
      }
    }
  ],
  shipping: {
    nome: { type: String, required: true },
    endereco: { type: String, required: true },
    provincia: { type: String, required: true },
    cidade: { type: String, required: true },
    postal: { type: String },
  },
  paymentMethod: { type: String, required: true },
  totalPrice: { type: Number, required: true },
  bilhete: { type: String, default: null },
  status: { type: String, default: 'pending' }, // e.g. pending, completed, payment_unconfirmed
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
