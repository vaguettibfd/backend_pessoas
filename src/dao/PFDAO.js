import PF from "../models/PF.js";

export default class PFDAO {
  async listar() {
    return await PF.find()
      .populate("endereco")
      .populate("telefones")
      .populate("titulo");
  }

  async salvar(pfData) {
    const pf = new PF(pfData);
    return await pf.save();
  }

  async atualizar(id, novosDados) {
    return await PF.findByIdAndUpdate(id, novosDados, { new: true });
  }

  async excluir(id) {
    return await PF.findByIdAndDelete(id);
  }
}
