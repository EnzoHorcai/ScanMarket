const express = require('express');
const router = express.Router();
const ProdutoController = require('../controllers/produto_controller');

router.get('/produtos', ProdutoController.listarTodos);
router.get('/produtos:id_mercado/:codigo', ProdutoController.buscarPorCodigo);
router.post('/produtos', ProdutoController.criar);
router.put('/produtos:id', ProdutoController.atualizar);
router.delete('/produtos:id', ProdutoController.deletar);

module.exports = router;