import mongoose from "mongoose";

const PessoaSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: String,
  endereco: { type: mongoose.Schema.Types.ObjectId, ref: "Endereco" },
  telefones: [{ type: mongoose.Schema.Types.ObjectId, ref: "Telefone" }]
}, { discriminatorKey: "tipo", timestamps: true });

export default mongoose.model("Pessoa", PessoaSchema);
