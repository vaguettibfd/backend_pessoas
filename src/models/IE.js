import mongoose from "mongoose";

const IESchema = new mongoose.Schema({
  numero: {
    type: String,
    required: [true, "O número da inscrição estadual é obrigatório."]
  },
  estado: {
    type: String,
    required: [true, "O estado da inscrição é obrigatório."]
  },
  dataRegistro: {
    type: Date,
    default: Date.now
  },
  pj: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PJ"
  }
}, { timestamps: true });

// Exportação padrão obrigatória (para evitar erro de import)
export default mongoose.model("IE", IESchema);
