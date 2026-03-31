const ProdutoService = require('../services/produto_service');

const ProdutoController = {
    buscarPorCodigo: async (req, res) => {
        try {
            const { id_mercado, codigo } = req.params;
            
            const produto = await ProdutoService.buscarPorCodigo(id_mercado, codigo);
            
            if (!produto) {
                return res.status(404).json({ message: "Produto não encontrado neste mercado" });
            }
            
            return res.json(produto);

        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },

    criar: async (req,res) => {
        try{
            const {codigo, nome} = req.params;
            
            const produto = await ProdutoService.criar(codigo, nome)

            if(!produto){
                return res.status(400).json({message: "Produto inválido." })
            }

            return res.json(201).json({message: "Produto criado com sucesso."})
        } catch(error) {
            return res.status(500).json({ error: error.message })
        }
    }
};

module.exports = ProdutoController;