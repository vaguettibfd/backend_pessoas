import mongoose from "mongoose";

const TituloSchema = new mongoose.Schema({
  numero: String,
  zona: String,
  secao: String,
  pf: { type: mongoose.Schema.Types.ObjectId, ref: "PF" }
}, { timestamps: true });

export default mongoose.model("Titulo", TituloSchema);
