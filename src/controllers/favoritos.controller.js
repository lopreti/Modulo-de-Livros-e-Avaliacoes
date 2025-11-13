import { db } from "../config/db.js";

export async function listarFavoritos(req, res) {
    try {
        const query = `
            SELECT 
                f.*,
                u.nome as usuario_nome,
                l.titulo as livro_titulo,
                l.autor as livro_autor
            FROM favoritos f
            JOIN usuarios u ON f.usuario_id = u.id
            JOIN livros l ON f.livro_id = l.id
        `;
        const [rows] = await db.execute(query);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}

export async function criarFavorito(req, res) {
    try {
        const { usuario_id, livro_id } = req.body;
        if (!usuario_id || !livro_id) {
            return res.status(400).json({ erro: "Preencha todos os campos obrigatórios" });
        }

        const [result] = await db.execute(
            "INSERT INTO favoritos (usuario_id, livro_id) VALUES (?, ?)",
            [usuario_id, livro_id]
        );
        res.status(201).json({ mensagem: "Favorito adicionado com sucesso!", id: result.insertId });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}

export async function excluirFavorito(req, res) {
    try {
        const [result] = await db.execute("DELETE FROM favoritos WHERE id = ?", [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ erro: "Favorito não encontrado" });
        res.json({ mensagem: "Favorito removido com sucesso!" });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}

export async function listarFavoritosUsuario(req, res) {
    try {
        const query = `
            SELECT 
                f.*,
                l.titulo,
                l.autor,
                l.genero
            FROM favoritos f
            JOIN livros l ON f.livro_id = l.id
            WHERE f.usuario_id = ?
        `;
        const [rows] = await db.execute(query, [req.params.id]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}