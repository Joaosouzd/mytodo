const pool = require('../db');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function listarUsuarios() {
  try {
    const resultado = await pool.query('SELECT * FROM usuarios');
    if (resultado.rows.length === 0) {
      console.log('Nenhum usuário cadastrado.');
      rl.close();
      await pool.end();
      return;
    }

    console.log('Lista de usuários:');
    console.table(resultado.rows);

    rl.question('Digite o ID do usuário que deseja gerenciar (ou 0 para sair): ', async (inputId) => {
      const idUsuario = parseInt(inputId.trim());

      if (isNaN(idUsuario)) {
        console.log('ID inválido.');
        rl.close();
        await pool.end();
        return;
      }

      if (idUsuario === 0) {
        console.log('Saindo...');
        rl.close();
        await pool.end();
        return;
      }

      // Verifica se o usuário existe
      const usuarioSelecionado = resultado.rows.find(u => u.id === idUsuario);

      if (!usuarioSelecionado) {
        console.log('Usuário não encontrado.');
        rl.close();
        await pool.end();
        return;
      }

      console.log(`Usuário selecionado: ${usuarioSelecionado.nome}`);

      rl.question('O que deseja fazer?\n1 - Excluir usuário\n2 - Alterar nome\n0 - Sair\nDigite a opção: ', async (acao) => {
        const opcao = acao.trim();

        if (opcao === '1') {
          // Excluir usuário
          try {
            const res = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [idUsuario]);
            if (res.rowCount > 0) {
              console.log('Usuário excluído com sucesso.');
            } else {
              console.log('Erro ao excluir usuário.');
            }
          } catch (err) {
            console.error('Erro ao excluir usuário:', err.message);
          } finally {
            rl.close();
            await pool.end();
          }

        } else if (opcao === '2') {
          // Alterar nome
          rl.question('Digite o novo nome do usuário: ', async (novoNome) => {
            try {
              const res = await pool.query('UPDATE usuarios SET nome = $1 WHERE id = $2 RETURNING *', [novoNome.trim(), idUsuario]);
              if (res.rowCount > 0) {
                console.log(`Nome alterado para: ${novoNome.trim()}`);
              } else {
                console.log('Erro ao alterar nome.');
              }
            } catch (err) {
              console.error('Erro ao alterar nome:', err.message);
            } finally {
              rl.close();
              await pool.end();
            }
          });

        } else if (opcao === '0') {
          console.log('Saindo...');
          rl.close();
          await pool.end();

        } else {
          console.log('Opção inválida.');
          rl.close();
          await pool.end();
        }
      });

    });

  } catch (erro) {
    console.error('Erro ao buscar usuários:', erro.message);
    rl.close();
    await pool.end();
  }
}

listarUsuarios();
