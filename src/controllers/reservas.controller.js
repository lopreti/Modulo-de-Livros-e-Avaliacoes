import { db } from "../config/db.js";

export async function listarReservas(req, res) {
    try {
        const query = `
            SELECT 
                r.*,
                u.nome as usuario_nome,
                u.email as usuario_email,
                l.titulo as livro_titulo,
                l.autor as livro_autor
            FROM reservas r
            JOIN usuarios u ON r.usuario_id = u.id
            JOIN livros l ON r.livro_id = l.id
        `;
        const [rows] = await db.execute(query);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}

export async function criarReserva(req, res) {
    try {
        const { usuario_id, livro_id, data_retirada, data_devolucao } = req.body;
        if (!usuario_id || !livro_id || !data_retirada || !data_devolucao) {
            return res.status(400).json({ erro: "Preencha todos os campos obrigatórios" });
        }

        const [result] = await db.execute(
            "INSERT INTO reservas (usuario_id, livro_id, data_retirada, data_devolucao) VALUES (?, ?, ?, ?)",
            [usuario_id, livro_id, data_retirada, data_devolucao]
        );
        res.status(201).json({ mensagem: "Reserva criada com sucesso!", id: result.insertId });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}

export async function excluirReserva(req, res) {
    try {
        const [result] = await db.execute("DELETE FROM reservas WHERE id = ?", [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ erro: "Reserva não encontrada" });
        res.json({ mensagem: "Reserva excluída com sucesso!" });
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}

export async function listarReservasAtivas(req, res) {
    try {
        const query = `
            SELECT 
                r.*,
                u.nome as usuario_nome,
                l.titulo as livro_titulo
            FROM reservas r
            JOIN usuarios u ON r.usuario_id = u.id
            JOIN livros l ON r.livro_id = l.id
            WHERE r.data_devolucao >= CURDATE()
        `;
        const [rows] = await db.execute(query);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
}