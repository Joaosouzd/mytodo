const pool = require('../db');
const readline = require('readline');
const { promisify } = require('util');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = promisify(rl.question).bind(rl);

async function criarUsuario(nome, email, senha) {
  try {
    // Verifica se o email já existe
    const resExist = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
    if (resExist.rowCount > 0) {
      console.error('Email já cadastrado.');
      return;
    }

    // Insere o usuário
    const resultado = await pool.query(
      `INSERT INTO usuarios (nome, email, senha)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [nome, email, senha]
    );

    console.log('Usuário criado com sucesso:');
    console.table(resultado.rows);

  } catch (erro) {
    console.error('Erro ao criar usuário:', erro.message);
  } finally {
    pool.end();
    rl.close();
  }
}

async function main() {
  try {
    const nome = await question('Digite o nome do usuário: ');
    const email = await question('Digite o email do usuário: ');
    const senha = await question('Digite a senha do usuário: ');

    await criarUsuario(nome.trim(), email.trim(), senha.trim());
  } catch (err) {
    console.error('Erro na entrada:', err);
    pool.end();
    rl.close();
  }
}

main();
