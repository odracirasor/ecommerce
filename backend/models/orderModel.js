import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    items: [
      {
        _id: String,
        name: String,
        price: Number,
        quantity: Number,
      }
    ],
    shipping: {
      nome: String,
      endereco: String,
      provincia: String,
      cidade: String,
      postal: String,
    },
    paymentMethod: { type: String, required: true },
    total: { type: Number, required: true },
    bilhete: { type: String },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
