import PF from "../models/PF.js";
import Endereco from "../models/Endereco.js";
import Telefone from "../models/Telefone.js";
import Titulo from "../models/Titulo.js";

export default class PFDAO {
  async listar() {
    return await PF.find()
      .populate("endereco")
      .populate("telefones")
      .populate("titulo");
  }

  async salvar(pfData) {
    try {
      // 🔹 Cria Endereco se veio como objeto
      if (pfData.endereco && typeof pfData.endereco === "object" && !pfData.endereco._id) {
        const novoEnd = await Endereco.create(pfData.endereco);
        pfData.endereco = novoEnd._id;
      }

      // 🔹 Cria Telefones se vieram como objetos
      if (Array.isArray(pfData.telefones)) {
        const telIds = [];
        for (const tel of pfData.telefones) {
          if (typeof tel === "object" && !tel._id) {
            const novoTel = await Telefone.create(tel);
            telIds.push(novoTel._id);
          } else {
            telIds.push(tel);
          }
        }
        pfData.telefones = telIds;
      }

      // 🔹 Cria Titulo se veio como objeto
      if (pfData.titulo && typeof pfData.titulo === "object" && !pfData.titulo._id) {
        const novoTitulo = await Titulo.create(pfData.titulo);
        pfData.titulo = novoTitulo._id;
      }

      // 🔹 Agora salva o PF com as referências corretas
      const pf = new PF(pfData);
      return await pf.save();
    } catch (err) {
      console.error("❌ Erro ao salvar PF:", err.message);
      throw err;
    }
  }

  async atualizar(id, novosDados) {
    return await PF.findByIdAndUpdate(id, novosDados, { new: true });
  }

  async excluir(id) {
    return await PF.findByIdAndDelete(id);
  }
}
