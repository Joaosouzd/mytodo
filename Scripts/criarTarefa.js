const pool = require('../db');
const readline = require('readline');
const { promisify } = require('util');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const question = promisify(rl.question).bind(rl);

function formatarDataBRparaISO(dataBR) {
  const regex = /^\d{2}-\d{2}-\d{4}$/;
  if (!regex.test(dataBR)) {
    throw new Error('Formato de data inválido. Use DD-MM-YYYY.');
  }
  const [dia, mes, ano] = dataBR.split('-');
  return `${ano}-${mes}-${dia}`;
}

async function atribuirTarefa(nomeTarefa, prazoBR, nomeUsuario) {
  try {
    const prazoISO = formatarDataBRparaISO(prazoBR);

    // 1. Buscar usuário pelo nome
    const resUsuario = await pool.query(
      'SELECT id FROM usuarios WHERE nome = $1',
      [nomeUsuario]
    );
    if (resUsuario.rowCount === 0) {
      console.error(`Usuário "${nomeUsuario}" não encontrado.`);
      return;
    }
    const idUsuario = resUsuario.rows[0].id;

    // 2. Buscar listas do usuário
    const resListas = await pool.query(
      'SELECT id, titulo FROM lista WHERE id_usuario = $1',
      [idUsuario]
    );
    if (resListas.rowCount === 0) {
      console.warn('Este usuário não possui listas criadas.');
      console.warn('Crie uma lista primeiro antes de atribuir tarefas.');
      return;
    }

    console.log('\nListas disponíveis para o usuário:');
    resListas.rows.forEach((lista, index) => {
      console.log(`${index + 1} - ${lista.titulo} (ID: ${lista.id})`);
    });

    // Pergunta qual lista usar
    const numEscolhido = await question('\nDigite o número da lista para adicionar a tarefa: ');
    const idx = parseInt(numEscolhido);
    if (isNaN(idx) || idx < 1 || idx > resListas.rowCount) {
      console.error('Esta lista não existe!');
      return;
    }

    const idListaEscolhida = resListas.rows[idx - 1].id;

    // Inserir tarefa na tabela tarefas, incluindo id_lista
    const insertTarefa = await pool.query(
      `INSERT INTO tarefas (nome, prazo, id_usuario, id_lista)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [nomeTarefa, prazoISO, idUsuario, idListaEscolhida]
    );

    console.log('Tarefa atribuída com sucesso:');
    console.table(insertTarefa.rows);

  } catch (erro) {
    console.error('Erro ao atribuir tarefa:', erro.message);
  } finally {
    pool.end();
    rl.close();
  }
}

async function main() {
  try {
    const nomeTarefa = await question('Digite o nome da tarefa: ');
    const prazo = await question('Digite o prazo da tarefa (formato DD-MM-YYYY): ');
    const nomeUsuario = await question('Digite o nome do usuário a ser atribuído: ');

    await atribuirTarefa(nomeTarefa.trim(), prazo.trim(), nomeUsuario.trim());
  } catch (err) {
    console.error('Erro na entrada:', err);
    pool.end();
    rl.close();
  }
}

main();
