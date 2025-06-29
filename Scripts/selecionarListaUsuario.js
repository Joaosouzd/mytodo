const pool = require('../db');
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

// Buscar listas do usuário pelo nome
async function listarListasDoUsuario(nomeUsuario) {
  const query = `
    SELECT lista.id, lista.titulo, usuarios.nome AS usuario
    FROM lista
    JOIN usuarios ON lista.id_usuario = usuarios.id
    WHERE LOWER(usuarios.nome) = LOWER($1)
    ORDER BY lista.id;
  `;
  const res = await pool.query(query, [nomeUsuario]);
  return res.rows;
}

// Buscar tarefas da lista
async function listarTarefasDaLista(idLista) {
  const query = `
    SELECT tarefas.nome AS tarefa, TO_CHAR(tarefas.prazo, 'DD-MM-YYYY') AS prazo
    FROM tarefas
    WHERE tarefas.id_lista = $1
    ORDER BY tarefas.prazo;
  `;
  const res = await pool.query(query, [idLista]);
  return res.rows;
}

// Excluir lista pelo id
async function excluirListaPorId(idLista) {
  try {
    const res = await pool.query('DELETE FROM lista WHERE id = $1 RETURNING *', [idLista]);
    if (res.rowCount === 0) {
      console.log('Lista não encontrada.');
    } else {
      console.log('Lista excluída com sucesso.');
    }
  } catch (err) {
    console.error('Erro ao excluir lista:', err.message);
  }
}

// Alterar nome da lista pelo id
async function alterarNomeLista(idLista, novoNome) {
  try {
    const res = await pool.query('UPDATE lista SET titulo = $1 WHERE id = $2 RETURNING *', [novoNome, idLista]);
    if (res.rowCount === 0) {
      console.log('Lista não encontrada.');
    } else {
      console.log(`Nome da lista alterado para "${novoNome}".`);
    }
  } catch (err) {
    console.error('Erro ao alterar nome da lista:', err.message);
  }
}

async function main() {
  rl.question('Digite o nome do usuário que deseja listar: ', async (nomeUsuario) => {
    try {
      const listas = await listarListasDoUsuario(nomeUsuario.trim());

      if (listas.length === 0) {
        console.log(`Nenhuma lista encontrada para o usuário "${nomeUsuario}".`);
        rl.close();
        pool.end();
        return;
      }

      console.log(`\nListas do usuário "${nomeUsuario}":\n`);
      listas.forEach((l, index) => {
        console.log(`${index + 1}. ${l.titulo} [ID: ${l.id}]`);
      });

      rl.question('\nDigite o número da lista que deseja visualizar: ', async (input) => {
        const index = parseInt(input.trim()) - 1;

        if (isNaN(index) || index < 0 || index >= listas.length) {
          console.log('Opção inválida.');
          rl.close();
          pool.end();
          return;
        }

        const listaSelecionada = listas[index];
        const tarefas = await listarTarefasDaLista(listaSelecionada.id);

        console.log(`\nLista: ${listaSelecionada.titulo} (Usuário: ${listaSelecionada.usuario})`);
        if (tarefas.length > 0) {
          console.table(tarefas);
        } else {
          console.log('Nenhuma tarefa atribuída a esta lista.');
        }

        // Pergunta o que quer fazer com a lista
        rl.question('\nO que você deseja fazer com essa lista?\n1 - Excluir\n2 - Alterar nome\n3 - Sair\nDigite a opção: ', async (acao) => {
          if (acao.trim() === '1') {
            await excluirListaPorId(listaSelecionada.id);
            rl.close();
            pool.end();
          } else if (acao.trim() === '2') {
            rl.question('Digite o novo nome da lista: ', async (novoNome) => {
              await alterarNomeLista(listaSelecionada.id, novoNome.trim());
              rl.close();
              pool.end();
            });
          } else if (acao.trim() === '3') {
            console.log('Saindo sem alterações...');
            rl.close();
            pool.end();
          } else {
            console.log('Opção inválida.');
            rl.close();
            pool.end();
          }
        });

      });

    } catch (err) {
      console.error('Erro:', err.message);
      rl.close();
      pool.end();
    }
  });
}

main();
