import express from 'express';
import PFDAO from '../dao/PFDAO.js';

const router = express.Router();
const dao = new PFDAO();

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

export default router;
