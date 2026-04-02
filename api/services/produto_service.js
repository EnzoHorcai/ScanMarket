const ProdutoService = {
    // 1. LISTAR TODOS OS PRODUTOS (Geral)
    listarTodos: (req, res) => {
        const sql = "SELECT * FROM PRODUTOS";
        db.all(sql, [], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        });
    },

    // 2. BUSCAR UM PRODUTO PELO CÓDIGO DE BARRAS + PREÇO NO MERCADO
    // Rota sugerida: GET /api/produtos/:id_mercado/:codigo
    buscarPorCodigo: (req, res) => {
        const { id_mercado, codigo } = req.params;
        
        const sql = `
            SELECT p.ID_PRODUTO, p.NOME, p.CODIGO, pm.PRECO 
            FROM PRODUTOS p
            JOIN PRODUTOS_MERCADOS pm ON p.ID_PRODUTO = pm.FK_PRODUTOS_ID_PRODUTO
            WHERE pm.FK_MERCADO_ID_MERCADO = ? AND p.CODIGO = ?
        `;

        db.get(sql, [id_mercado, codigo], (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!row) return res.status(404).json({ message: "Produto não encontrado neste mercado" });
            res.json(row);
        });
    },

    // 3. CADASTRAR NOVO PRODUTO (Painel Admin)
    criar: (req, res) => {
        const { codigo, nome } = req.body;
        const sql = "INSERT INTO PRODUTOS (NOME, CODIGO) VALUES (?, ?)";
        
        db.run(sql, [codigo, nome], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, codigo, nome });
        });
    },

    // 4. ATUALIZAR PRODUTO
    atualizar: (req, res) => {
        const { id } = req.params;
        const { nome, codigo } = req.body;
        const sql = "UPDATE PRODUTOS SET NOME = ?, CODIGO = ? WHERE ID_PRODUTO = ?";

        db.run(sql, [nome, codigo, id], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Produto atualizado com sucesso", changes: this.changes });
        });
    },

    // 5. DELETAR PRODUTO
    deletar: (req, res) => {
        const { id } = req.params;
        const sql = "DELETE FROM PRODUTOS WHERE ID_PRODUTO = ?";

        db.run(sql, id, function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Produto removido", changes: this.changes });
        });
    }
};

module.exports = ProdutoService;