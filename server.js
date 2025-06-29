const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rotas da API
app.get('/api/usuarios', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios ORDER BY nome');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/usuarios', async (req, res) => {
  try {
    const { nome, email } = req.body;
    const result = await pool.query(
      'INSERT INTO usuarios (nome, email) VALUES ($1, $2) RETURNING *',
      [nome, email]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/listas/:usuarioId', async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const result = await pool.query(
      'SELECT * FROM listas WHERE usuario_id = $1 ORDER BY nome',
      [usuarioId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/listas', async (req, res) => {
  try {
    const { nome, usuario_id } = req.body;
    const result = await pool.query(
      'INSERT INTO listas (nome, usuario_id) VALUES ($1, $2) RETURNING *',
      [nome, usuario_id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/tarefas/:listaId', async (req, res) => {
  try {
    const { listaId } = req.params;
    const result = await pool.query(
      'SELECT * FROM tarefas WHERE lista_id = $1 ORDER BY criada_em DESC',
      [listaId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tarefas', async (req, res) => {
  try {
    const { titulo, descricao, lista_id } = req.body;
    const result = await pool.query(
      'INSERT INTO tarefas (titulo, descricao, lista_id) VALUES ($1, $2, $3) RETURNING *',
      [titulo, descricao, lista_id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/tarefas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM tarefas WHERE id = $1', [id]);
    res.json({ message: 'Tarefa excluída com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/tarefas/:id/concluir', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'UPDATE tarefas SET concluida = NOT concluida WHERE id = $1 RETURNING *',
      [id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📱 Acesse o MyTodo em seu navegador!`);
}); 