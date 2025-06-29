const pool = require('../db');
const readline = require('readline');
const { promisify } = require('util');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const question = promisify(rl.question).bind(rl);

async function criarLista(nomeUsuario, titulo, descricao) {
  try {
    // Buscar id do usuário pelo nome
    const resUsuario = await pool.query(
      'SELECT id FROM usuarios WHERE nome = $1',
      [nomeUsuario]
    );

    if (resUsuario.rowCount === 0) {
      console.error(`Usuário "${nomeUsuario}" não encontrado.`);
      return;
    }

    const idUsuario = resUsuario.rows[0].id;

    // Inserir lista usando o idUsuario
    const resultado = await pool.query(
      `INSERT INTO lista (id_usuario, titulo, descricao)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [idUsuario, titulo, descricao]
    );

    console.log('Lista criada com sucesso:');
    console.table(resultado.rows);

  } catch (erro) {
    console.error('Erro ao criar lista:', erro.message);
  } finally {
    pool.end();
    rl.close();
  }
}

async function main() {
  try {
    const nomeUsuario = await question('Digite o nome do usuário para criar a lista: ');
    const titulo = await question('Digite o título da lista: ');
    const descricao = await question('Digite a descrição da lista (opcional): ');

    await criarLista(nomeUsuario.trim(), titulo.trim(), descricao.trim());
  } catch (err) {
    console.error('Erro na entrada:', err);
    pool.end();
    rl.close();
  }
}

main();
