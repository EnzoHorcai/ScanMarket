//import { Html5QrcodeScanner } from 'html5-qrcode';

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const db = new sqlite3.Database('./scanmarket.db');

app.use(cors());
app.use(express.json());

db.serialize(() => {

    db.run(`CREATE TABLE IF NOT EXISTS LOGIN (ID_LOGIN INTEGER PRIMARY KEY AUTOINCREMENT, USUARIO TEXT, SENHA TEXT)`);
    db.run(`CREATE TABLE IF NOT EXISTS CLIENTE (ID_CLIENTE INTEGER PRIMARY KEY AUTOINCREMENT, NOME TEXT, TELEFONE TEXT, EMAIL TEXT, FK_LOGIN_ID_LOGIN INTEGER, FOREIGN KEY(FK_LOGIN_ID_LOGIN) REFERENCES LOGIN(ID_LOGIN))`);
    db.run(`CREATE TABLE IF NOT EXISTS MERCADO (ID_MERCADO INTEGER PRIMARY KEY AUTOINCREMENT, NOME TEXT, TELEFONE TEXT, ENDERECO TEXT)`);
    db.run(`CREATE TABLE IF NOT EXISTS PRODUTOS (ID_PRODUTO INTEGER PRIMARY KEY AUTOINCREMENT, CODIGO TEXT, NOME TEXT)`);
    db.run(`CREATE TABLE IF NOT EXISTS PRODUTOS_MERCADOS (FK_MERCADO_ID_MERCADO INTEGER, FK_PRODUTOS_ID_PRODUTO INTEGER, PRECO REAL, PRIMARY KEY(FK_MERCADO_ID_MERCADO, FK_PRODUTOS_ID_PRODUTO))`);
    db.run(`CREATE TABLE IF NOT EXISTS CARRINHO (ID_CARRINHO INTEGER PRIMARY KEY AUTOINCREMENT, DATA_CRIACAO TEXT, STATUS TEXT, FK_ID_MERCADO INTEGER, FK_ID_CLIENTE INTEGER)`);
    db.run(`CREATE TABLE IF NOT EXISTS PRODUTO_CARRINHO (FK_PRODUTOS_ID_PRODUTO INTEGER, FK_CARRINHO_ID_CARRINHO INTEGER, QUANTIDADE INTEGER, PRECO_VENDA REAL)`);

    db.get("SELECT count(*) as count FROM LOGIN", (err, row) => {
        if (row.count === 0) {
            db.run(`INSERT INTO LOGIN (USUARIO, SENHA) VALUES ('12345678900', '123')`);
            db.run(`INSERT INTO CLIENTE (NOME, FK_LOGIN_ID_LOGIN) VALUES ('Usuário Teste', 1)`);
            db.run(`INSERT INTO MERCADO (NOME, ENDERECO) VALUES ('Supermercado Bom Preço', 'Av. Paulista, 1000')`);
            db.run(`INSERT INTO PRODUTOS (CODIGO, NOME) VALUES ('789123', 'Café 500g'), ('789456', 'Arroz 5kg')`);
            db.run(`INSERT INTO PRODUTOS_MERCADOS VALUES (1, 1, 15.50), (1, 2, 22.90)`);
            console.log("Dados iniciais de teste inseridos.");
        }
    });
});

app.post('/api/login', (req, res) => {
    const { usuario, senha } = req.body;
    const sql = `SELECT C.* FROM LOGIN L JOIN CLIENTE C ON L.ID_LOGIN = C.FK_LOGIN_ID_LOGIN WHERE L.USUARIO = ? AND L.SENHA = ?`;
    db.get(sql, [usuario, senha], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        row ? res.json(row) : res.status(401).json({ message: "Credenciais inválidas" });
    });
});


app.get('/api/mercados', (req, res) => {
    db.all("SELECT * FROM MERCADO", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 3. Buscar Produto pelo Código de Barras em um Mercado específico
app.get('/api/produtos/:idMercado/:codigo', (req, res) => {
    const { idMercado, codigo } = req.params;
    const sql = `
        SELECT P.ID_PRODUTO, P.NOME, PM.PRECO 
        FROM PRODUTOS P 
        JOIN PRODUTOS_MERCADOS PM ON P.ID_PRODUTO = PM.FK_PRODUTOS_ID_PRODUTO 
        WHERE PM.FK_MERCADO_ID_MERCADO = ? AND P.CODIGO = ?`;
    
    db.get(sql, [idMercado, codigo], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        row ? res.json(row) : res.status(404).json({ message: "Produto não encontrado neste mercado" });
    });
});

app.post('/api/checkout', (req, res) => {
    const { id_cliente, id_mercado, itens } = req.body;
    const data = new Date().toISOString();

    db.run(`INSERT INTO CARRINHO (DATA_CRIACAO, STATUS, FK_ID_MERCADO, FK_ID_CLIENTE) VALUES (?, 'PAGO', ?, ?)`, 
    [data, id_mercado, id_cliente], function(err) {
        if (err) return res.status(500).json({ error: err.message });

        const idCarrinho = this.lastID;
        const stmt = db.prepare(`INSERT INTO PRODUTO_CARRINHO (FK_PRODUTOS_ID_PRODUTO, FK_CARRINHO_ID_CARRINHO, QUANTIDADE, PRECO_VENDA) VALUES (?, ?, ?, ?)`);
        
        itens.forEach(item => {
            stmt.run(item.id_produto, idCarrinho, 1, item.preco);
        });
        
        stmt.finalize();
        res.json({ success: true, id_carrinho: idCarrinho });
    });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor ScanMarket rodando em http://localhost:${PORT}`));