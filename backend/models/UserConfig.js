// models/UserConfig.js
import mongoose from 'mongoose';

const UserConfigSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  username: { type: String, required: true },
  biType: { type: String, enum: ['none', 'number', 'image'], default: 'none' },
  biNumber: { type: String },
  biImageUrl: { type: String }, // URL da imagem armazenada (ex: S3, local, etc)
  background: { type: String, default: 'white' },
}, { timestamps: true });

export default mongoose.model('UserConfig', UserConfigSchema);
