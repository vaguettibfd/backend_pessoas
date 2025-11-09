import PF from "../models/PF.js";

export default class PFDAO {
  async listar() {
    return await PF.find()
      .populate("endereco")
      .populate("telefones")
      .populate("titulo");
  }

  async salvar(pfData) {

      // 🔹 Cria Endereco se veio como objeto
      if (pfData.endereco && typeof pfData.endereco === "object") {
        const novoEnd = await Endereco.create(pfData.endereco);
        pfData.endereco = novoEnd._id;
      }
  
      // 🔹 Cria Telefones se vieram como objetos
      if (pfData.telefones && Array.isArray(pfData.telefones)) {
        const telIds = [];
        for (const tel of pfData.telefones) {
          if (typeof tel === "object") {
            const novoTel = await Telefone.create(tel);
            telIds.push(novoTel._id);
          } else {
            telIds.push(tel);
          }
        }
        pfData.telefones = telIds;
      }
  
      // 🔹 Cria Titulo se veio como objeto
      if (pfData.titulo && typeof pfData.titulo === "object") {
        const novoTitulo = await Titulo.create(pfData.titulo);
        pfData.titulo = novoTitulo._id;
      }
      
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
