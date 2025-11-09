import PJ from '../models/PJ.js';
import Endereco from "../models/Endereco.js";
import Telefone from "../models/Telefone.js";
import IE from "../models/IE.js";

export default class PJDAO {
  async listar() {
    return await PJ.find()
      .populate('endereco')
      .populate('telefones')
      .populate('ie');
  }

  async salvar(pjData) {
    try {
      // 🔹 Cria Endereco se veio como objeto
      if (pjData.endereco && typeof pjData.endereco === "object" && !pjData.endereco._id) {
        const novoEnd = await Endereco.create(pjData.endereco);
        pjData.endereco = novoEnd._id;
      }

      // 🔹 Cria Telefones se vieram como objetos
      if (pjData.telefones && Array.isArray(pjData.telefones)) {
        const telIds = [];
        for (const tel of pjData.telefones) {
          if (typeof tel === "object" && !tel._id) {
            const novoTel = await Telefone.create(tel);
            telIds.push(novoTel._id);
          } else {
            telIds.push(tel);
          }
        }
        pjData.telefones = telIds;
      }

      // 🔹 Cria IE se veio como objeto
      if (pjData.ie && typeof pjData.ie === "object" && !pjData.ie._id) {
        const novoIE = await IE.create(pjData.ie);
        pjData.ie = novoIE._id;
      }

      // 🔹 Agora salva o PJ com as referências corretas
      const pj = new PJ(pjData);
      return await pj.save();
    } catch (err) {
      console.error("❌ Erro ao salvar PJ:", err.message);
      throw err;
    }
  }

  async atualizar(id, novosDados) {
    return await PJ.findByIdAndUpdate(id, novosDados, { new: true });
  }

  async excluir(id) {
    return await PJ.findByIdAndDelete(id);
  }
}
