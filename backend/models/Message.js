import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    room: { type: String, required: true }
  },
  { timestamps: true } // ✅ Isso adiciona createdAt e updatedAt automaticamente
);

export default mongoose.model('Message', messageSchema);
