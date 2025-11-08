import PJ from '../models/PJ.js';

export default class PJDAO {
  async listar() {
    return await PJ.find()
      .populate('endereco')
      .populate('telefones')
      .populate('ie');
  }

  async salvar(pjData) {
    const pj = new PJ(pjData);
    return await pj.save();
  }

  async atualizar(id, novosDados) {
    return await PJ.findByIdAndUpdate(id, novosDados, { new: true });
  }

  async excluir(id) {
    return await PJ.findByIdAndDelete(id);
  }
}
