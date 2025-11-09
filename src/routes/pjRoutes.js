import express from 'express';
import PJDAO from '../dao/PJDAO.js';

const router = express.Router();
const dao = new PJDAO();

router.get('/', async (req, res) => {
  res.json(await dao.listar());
});

router.post('/', async (req, res) => {
  res.status(201).json(await dao.salvar(req.body));
});

router.put('/:id', async (req, res) => {
  res.json(await dao.atualizar(req.params.id, req.body));
});

router.delete('/:id', async (req, res) => {
  await dao.excluir(req.params.id);
  res.json({ mensagem: 'Removido com sucesso!' });
});

// Listagem filtrada
router.get("/filtrar", async (req, res) => {
  try {
    const { nome } = req.query; // ?nome=Tech
    const lista = await dao.listarByName(nome);
    res.json(lista);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao listar PJs", detalhe: err.message });
  }
});


export default router;
