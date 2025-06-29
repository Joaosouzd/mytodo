const pool = require('../db');
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

async function listarTarefas() {
  const res = await pool.query(
    `SELECT tarefas.id, tarefas.nome, tarefas.prazo, usuarios.nome AS usuario, lista.titulo AS lista
     FROM tarefas
     JOIN usuarios ON tarefas.id_usuario = usuarios.id
     JOIN lista ON tarefas.id_lista = lista.id
     ORDER BY tarefas.id`
  );
  console.table(res.rows);
  return res.rows;
}

async function excluirTarefaPorId(idTarefa) {
  try {
    const res = await pool.query('DELETE FROM tarefas WHERE id = $1 RETURNING *', [idTarefa]);
    if (res.rowCount === 0) {
      console.log('Tarefa não encontrada.');
    } else {
      console.log('Tarefa excluída com sucesso.');
    }
  } catch (erro) {
    console.error('Erro ao excluir tarefa:', erro.message);
  }
}

async function main() {
  await listarTarefas();

  rl.question('Digite o ID da tarefa que deseja excluir: ', async (id) => {
    const idInt = parseInt(id.trim());
    if (isNaN(idInt)) {
      console.log('ID inválido.');
      rl.close();
      await pool.end();
      return;
    }

    await excluirTarefaPorId(idInt);

    rl.close();
    await pool.end();
  });
}

main();
