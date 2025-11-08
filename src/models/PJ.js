import mongoose from 'mongoose';
import Pessoa from './Pessoa.js';

const PJSchema = new mongoose.Schema({
  cnpj: { type: String, required: true, unique: true },
  ie: { type: mongoose.Schema.Types.ObjectId, ref: 'IE' },
});

export default Pessoa.discriminator('PJ', PJSchema);
