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
    try {
      // 🔹 Cria novo Endereco se vier como objeto
      if (novosDados.endereco && typeof novosDados.endereco === "object" && !novosDados.endereco._id) {
        const novoEnd = await Endereco.create(novosDados.endereco);
        novosDados.endereco = novoEnd._id;
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

      // 🔹 Atualiza ou cria Título se vier como objeto
      if (novosDados.titulo && typeof novosDados.titulo === "object") {
        if (novosDados.titulo._id) {
          await Titulo.findByIdAndUpdate(novosDados.titulo._id, novosDados.titulo);
        } else {
          const novoTitulo = await Titulo.create(novosDados.titulo);
          novosDados.titulo = novoTitulo._id;
        }
      }

      // 🔹 Atualiza o documento PF
      const atualizado = await PF.findByIdAndUpdate(id, novosDados, { new: true })
        .populate("endereco")
        .populate("telefones")
        .populate("titulo");

      return atualizado;
    } catch (err) {
      console.error("❌ Erro ao atualizar PF:", err.message);
      throw err;
    }
  }

  async excluir(id) {
    try {
      const pf = await PF.findById(id);

      if (!pf) {
        throw new Error("PF não encontrada para exclusão");
      }

      // 🔹 Remove o Título (1:1)
      if (pf.titulo) {
        await Titulo.findByIdAndDelete(pf.titulo);
      }
      // 🔹 Remove a própria PF
      await PF.findByIdAndDelete(id);

      return { mensagem: "PF e dados relacionados excluídos com sucesso" };
    } catch (err) {
      console.error("❌ Erro ao excluir PF:", err.message);
      throw err;
    }
  }
}
