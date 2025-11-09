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
    try {
      // 🔹 Cria novo Endereco se vier como objeto e ainda não existir
      if (novosDados.endereco && typeof novosDados.endereco === "object" && !novosDados.endereco._id) {
        const existente = await Endereco.findOne(novosDados.endereco);
        if (existente) {
          novosDados.endereco = existente._id;
        } else {
          const novoEnd = await Endereco.create(novosDados.endereco);
          novosDados.endereco = novoEnd._id;
        }
      }

      // 🔹 Cria novos Telefones se vierem como objetos
      if (Array.isArray(novosDados.telefones)) {
        const telIds = [];
        for (const tel of novosDados.telefones) {
          if (typeof tel === "object" && !tel._id) {
            const novoTel = await Telefone.create(tel);
            telIds.push(novoTel._id);
          } else {
            telIds.push(tel);
          }
        }
        novosDados.telefones = telIds;
      }

      // 🔹 Atualiza ou cria IE (Inscrição Estadual) se vier como objeto
      if (novosDados.ie && typeof novosDados.ie === "object") {
        if (novosDados.ie._id) {
          // Atualiza o documento IE existente
          await IE.findByIdAndUpdate(novosDados.ie._id, novosDados.ie);
        } else {
          // Cria um novo documento IE
          const novoIE = await IE.create(novosDados.ie);
          novosDados.ie = novoIE._id;
        }
      }

      // 🔹 Atualiza o documento PJ
      const atualizado = await PJ.findByIdAndUpdate(id, novosDados, { new: true })
        .populate("endereco")
        .populate("telefones")
        .populate("ie");

      return atualizado;
    } catch (err) {
      console.error("❌ Erro ao atualizar PJ:", err.message);
      throw err;
    }
  }

  async excluir(id) {
    try {
      const pj = await PJ.findById(id);

      if (!pj) {
        throw new Error("PJ não encontrada para exclusão");
      }

      // 🔹 Remove a Inscrição Estadual (1:1)
      if (pj.ie) {
        await IE.findByIdAndDelete(pj.ie);
      }

      // 🔹 Remove a própria PJ
      await PJ.findByIdAndDelete(id);

      return { mensagem: "PJ e dados exclusivos excluídos com sucesso" };
    } catch (err) {
      console.error("❌ Erro ao excluir PJ:", err.message);
      throw err;
    }
  }

  // listagem filtrando por nome
  async listarByName(nome) {
    const filtro = nome
      ? { nome: { $regex: nome, $options: "i" } }
      : {}; // sem filtro, lista todos
  
    return await PJ.find(filtro)
      .populate("endereco")
      .populate("telefones")
      .populate("titulo")
      .sort({ nome: 1 }); // ordena alfabeticamente
  }
}
