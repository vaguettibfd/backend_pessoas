import mongoose from 'mongoose';
import Pessoa from './Pessoa.js';

const PFSchema = new mongoose.Schema({
  cpf: { type: String, required: true, unique: true },
  titulo: { type: mongoose.Schema.Types.ObjectId, ref: 'Titulo' },
});

export default Pessoa.discriminator('PF', PFSchema);
